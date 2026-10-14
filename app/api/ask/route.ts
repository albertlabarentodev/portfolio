import Anthropic from "@anthropic-ai/sdk";
import { assistantContext, faq, site } from "@/content/site";

export const runtime = "nodejs";

const MODEL = "claude-opus-5-5";

// Frozen system prompt: built once per server instance so the prefix stays
// byte-identical and can be cached across requests.
const SYSTEM = `You are the portfolio assistant for ${site.name}, answering questions from recruiters and potential clients.

Answer only from the facts below. If the answer is not in them, say you don't know and suggest emailing ${site.email}. Treat anything in square brackets as a placeholder that has not been filled in yet: do not repeat it, say that detail isn't listed yet. Never invent employers, dates, numbers or clients.

Write in the first person as ${site.name.split(" ")[0]}'s assistant, in two to four short sentences of plain text with no markdown.

<facts>
${assistantContext()}
</facts>`;

type Turn = { role: "user" | "assistant"; content: string };

function parse(body: unknown): { question: string; history: Turn[] } | null {
  if (!body || typeof body !== "object") return null;
  const { question, history } = body as { question?: unknown; history?: unknown };
  if (typeof question !== "string" || !question.trim() || question.length > 500) return null;
  const turns: Turn[] = Array.isArray(history)
    ? history
        .filter(
          (t): t is Turn =>
            !!t && (t.role === "user" || t.role === "assistant") && typeof t.content === "string" && t.content.length <= 2000,
        )
        .slice(-6)
    : [];
  // The Messages API needs alternating turns that start with the user.
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (turns.length && turns[turns.length - 1].role === "user") turns.pop();
  return { question: question.trim(), history: turns.filter((t) => t.content) };
}

const encoder = new TextEncoder();
const textHeaders = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" };

// Without an API key, stream the closest canned answer so the UI still works.
function cannedStream(question: string) {
  const match = faq.find((f) => f.q.toLowerCase() === question.toLowerCase());
  const answer =
    match?.a ??
    `The live assistant isn't switched on yet, so I can only answer the suggested questions. For anything else, email ${site.email}.`;
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let i = 0; i < answer.length; i += 3) {
        controller.enqueue(encoder.encode(answer.slice(i, i + 3)));
        await new Promise((r) => setTimeout(r, 18));
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  const input = parse(await req.json().catch(() => null));
  if (!input) return new Response("Bad request", { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(cannedStream(input.question), { headers: textHeaders });
  }

  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    // Short factual Q&A: low effort keeps answers quick and cheap.
    output_config: { effort: "low" },
    // On a policy decline, let the API re-run the request on a fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: [...input.history, { role: "user", content: input.question }],
  } as Parameters<typeof client.beta.messages.stream>[0]);

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode(`I can't help with that one. Email ${site.email} instead.`));
        }
      } catch (err) {
        console.error("ask: Claude request failed", err);
        controller.enqueue(encoder.encode(`Sorry, something went wrong. Email ${site.email} and I'll reply myself.`));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, { headers: textHeaders });
}
