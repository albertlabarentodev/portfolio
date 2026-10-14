"use client";

import { useEffect, useRef, useState } from "react";
import { faq } from "@/content/site";
import { useSound } from "./sound";

type Turn = { role: "user" | "assistant"; content: string };

// "Ask my AI": streams answers from /api/ask, which uses the Claude API when
// a key is configured and canned answers otherwise.
export function AskAI() {
  const { blip } = useSound();
  const [turns, setTurns] = useState<Turn[]>([
    { role: "user", content: faq[0].q },
    { role: "assistant", content: faq[0].a },
  ]);
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [input, setInput] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  async function ask(question: string) {
    const q = question.trim().slice(0, 500);
    if (!q || busy) return;
    blip(620);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const history = turns.slice(-6);
    setTurns((t) => [...t, { role: "user", content: q }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setWaiting(true);

    const append = (text: string) =>
      setTurns((t) => {
        const next = t.slice();
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + text };
        return next;
      });

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setWaiting(false);
        append(decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        append("Sorry, the assistant is unavailable right now. Email me instead and I'll reply myself.");
      }
    } finally {
      setWaiting(false);
      setBusy(false);
    }
  }

  const last = turns[turns.length - 1];

  return (
    <div className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-panel">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <span className="flex items-center gap-2.5 text-[15px] font-medium text-ink">
          <span className="size-2 rounded-full bg-accent" />
          albert.assistant
        </span>
        <span className="label text-[11px]">Grounded in my résumé</span>
      </div>

      <div ref={logRef} aria-live="polite" className="flex max-h-[360px] min-h-[220px] flex-col gap-3.5 overflow-y-auto px-5 py-6">
        {turns.map((t, i) =>
          t.role === "user" ? (
            <div key={i} className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-[15px] font-medium text-accent-ink">
              {t.content}
            </div>
          ) : t.content || !(waiting && t === last) ? (
            <div key={i} className="max-w-[88%] self-start whitespace-pre-line rounded-2xl rounded-bl-sm bg-raised px-4 py-3 text-[15px] text-ink">
              {t.content}
              {busy && t === last && <span className="caret" aria-hidden="true" />}
            </div>
          ) : (
            <div key={i} className="typing-dots self-start rounded-2xl rounded-bl-sm bg-raised px-4 py-3.5" aria-label="Assistant is typing">
              <span /><span /><span />
            </div>
          ),
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-5 pb-4">
        {faq.map((f) => (
          <button
            key={f.q}
            type="button"
            disabled={busy}
            onClick={() => ask(f.q)}
            className="min-h-10 rounded-full border border-line-strong px-3.5 text-[13px] text-ink-2 transition hover:-translate-y-px hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {f.q}
          </button>
        ))}
      </div>

      <form
        className="flex gap-2 border-t border-line px-5 py-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <label htmlFor="ask-input" className="sr-only">Ask a question</label>
        <input
          id="ask-input"
          value={input}
          maxLength={500}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about stack, projects or availability"
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-line-strong bg-bg px-3.5 text-[15px] text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send question"
          className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-ink transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </div>
  );
}
