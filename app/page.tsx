import Image from "next/image";
import Link from "next/link";
import { experience, lab, notes, projects, site, stack } from "@/content/site";
import { AskAI } from "@/components/ask-ai";
import { Arrow, GhostButton, PrimaryButton, Section, SiteFooter, SiteHeader } from "@/components/chrome";
import { Spotlight } from "@/components/spotlight";
import { WorkflowGraph } from "@/components/workflow-graph";

export default function Home() {
  return (
    <div className="relative overflow-clip">
      <Spotlight />
      <SiteHeader />

      {/* Hero */}
      <section id="top" className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-12 px-5 pt-12 pb-10 sm:px-10 sm:pt-18">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-7">
          <div className="label flex animate-rise items-center gap-2.5 text-ink-2">
            <span className="relative size-2">
              <span className="absolute inset-0 animate-[ping-soft_1.8s_ease-out_infinite] rounded-full bg-accent" />
              <span className="absolute inset-0 rounded-full bg-accent" />
            </span>
            Full-stack engineer · Automation &amp; AI
          </div>
          <h1 className="text-[clamp(46px,6.2vw,92px)] leading-[0.98] font-semibold tracking-[-0.045em] text-ink">
            <span className="mask-line"><span>I build the app,</span></span>
            <span className="mask-line"><span className="[animation-delay:.12s]">then automate</span></span>
            <span className="mask-line"><span className="text-ink-3 [animation-delay:.24s]">everything around it.</span></span>
          </h1>
          <p className="max-w-[520px] animate-rise text-[19px] [animation-delay:.35s]">
            Laravel and Next.js products, wired to your CRM, inbox and team chat with n8n and Claude. Fewer copy-paste jobs, faster releases.
          </p>
          <div className="flex animate-rise flex-wrap gap-3 [animation-delay:.5s]">
            <PrimaryButton href={`mailto:${site.email}`}>Start a project</PrimaryButton>
            <GhostButton href="#work">See the work</GhostButton>
          </div>
        </div>
        <div className="min-w-0 flex-[1_1_520px] animate-rise [animation-delay:.65s]">
          <WorkflowGraph />
        </div>
      </section>

      {/* Stack strip */}
      <div aria-label="Stack" className="group relative mt-14 animate-fade overflow-hidden border-y border-line">
        <div className="flex w-max animate-marquee py-5 font-mono text-sm tracking-[0.08em] text-ink-3 uppercase group-hover:[animation-play-state:paused]">
          {[...stack, ...stack].map((s, i) => (
            <span key={i} className="flex items-center" aria-hidden={i >= stack.length || undefined}>
              <span className="px-7">{s}</span>
              <span className="text-accent">/</span>
            </span>
          ))}
        </div>
      </div>

      <main className="relative mx-auto max-w-7xl px-5 sm:px-10">
        {/* Work */}
        <Section id="work" index="01" label="Selected work">
          <div className="flex flex-col gap-24">
            {projects.map((p, i) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className="group scroll-rise flex flex-col gap-6">
                <div className="overflow-hidden rounded-[18px] border border-line bg-[#070b15] transition duration-700 ease-out-soft group-hover:-translate-y-1 group-hover:border-accent group-hover:shadow-[0_30px_80px_rgba(0,0,0,.5)] group-hover:[transform:perspective(1200px)_rotateX(2deg)_translateY(-4px)]">
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    width={1600}
                    height={1000}
                    priority={i === 0}
                    sizes="(min-width: 1280px) 940px, 100vw"
                    className="block h-auto w-full transition-transform duration-1000 ease-out-soft group-hover:scale-[1.035]"
                  />
                </div>
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex flex-[1_1_380px] flex-col gap-2.5">
                    <div className="label">{p.kicker}</div>
                    <h2 className="text-4xl leading-tight font-semibold tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
                      {p.title}{" "}
                      <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                    </h2>
                    <p className="max-w-[560px]">{p.summary}</p>
                  </div>
                  <div className="flex-[0_1_260px] border-l border-line pl-5">
                    <div className="text-[32px] font-semibold tracking-[-0.03em] text-accent">{p.metric}</div>
                    <div className="text-sm text-ink-3">{p.metricLabel}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* Lab */}
        <Section id="lab" index="02" label="Automation Lab">
          <div className="flex flex-col gap-7">
            <h2 className="scroll-rise max-w-[720px] text-[clamp(32px,4vw,44px)] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
              Small, working things. Each one ships with a demo and its source.
            </h2>
            <div className="scroll-rise grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {lab.map((l) => (
                <a key={l.title} href={l.href} className="group flex min-h-[180px] flex-col gap-2.5 bg-bg p-7 transition-colors hover:bg-surface">
                  <div className="label text-[11px]">{l.tag}</div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink">{l.title}</h3>
                  <p className="text-[15px]">{l.text}</p>
                  <Arrow className="mt-auto text-ink-3 group-hover:translate-x-1.5 group-hover:text-accent" />
                </a>
              ))}
            </div>
          </div>
        </Section>

        {/* About + experience */}
        <Section id="about" index="03" label="About">
          <div className="flex flex-col gap-16">
            <div className="flex flex-wrap items-start gap-10">
              <figure className="scroll-rise m-0 flex flex-[0_1_300px] flex-col gap-2.5">
                {/* Replace with your portrait: 4:5, dark backdrop, soft teal rim light. */}
                <div className="flex aspect-[4/5] items-center justify-center rounded-[18px] border border-dashed border-line-strong bg-panel bg-[radial-gradient(#18223a_1.2px,transparent_1.2px)] bg-size-[18px_18px]">
                  <span className="font-mono text-6xl font-medium text-line">{site.initials}</span>
                </div>
                <figcaption className="label text-[11px] tracking-[0.06em]">[Your portrait · 4:5]</figcaption>
              </figure>
              <div className="scroll-rise flex flex-[1_1_340px] flex-col gap-5">
                <p className="text-[26px] leading-[1.35] tracking-[-0.02em] text-ink">
                  I work between product and plumbing: Figma first, then a Laravel app with a Vue, React or Next.js front end, then the automations that keep it fed.
                </p>
                <p>
                  Most of my projects start with one question: where is someone still copying data by hand? I answer it with queues, webhooks, n8n workflows and Claude agents that call your own systems safely.
                </p>
                <p className="text-ink-3">[A short personal line: where you are based, what you do outside code, the kind of team you want to join.]</p>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="label border-b border-line pb-4">Experience</div>
              {experience.map((e) => (
                <div key={e.title} className="group scroll-rise flex flex-wrap items-baseline gap-6 border-b border-line px-4 py-7 transition-colors hover:bg-surface">
                  <div className="flex-[0_0_160px] font-mono text-[13px] text-ink-3">{e.dates}</div>
                  <div className="flex flex-[1_1_360px] flex-col gap-1.5">
                    <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-accent">{e.title}</h3>
                    <p className="text-[15px]">{e.text}</p>
                  </div>
                  <div className="flex-[0_1_220px] font-mono text-xs text-ink-3 uppercase">{e.tags}</div>
                </div>
              ))}
              <a href={site.resumeUrl} className="mt-5 inline-flex min-h-11 items-center gap-2 self-start font-medium text-accent hover:text-accent-soft">
                Full résumé (PDF) <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </Section>

        {/* Ask my AI */}
        <Section id="ask" index="04" label="Ask my AI">
          <div className="flex flex-wrap items-start gap-10">
            <div className="scroll-rise flex flex-[1_1_260px] flex-col gap-4">
              <h2 className="text-[clamp(32px,4vw,44px)] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">Interview my assistant.</h2>
              <p>It runs on the Claude API and only answers from my résumé, case studies and Lab notes. Ask it what a recruiter would.</p>
            </div>
            <div className="scroll-rise min-w-0 flex-[1.4_1_420px]">
              <AskAI />
            </div>
          </div>
        </Section>

        {/* Notes + uses */}
        <Section index="05" label="Notes">
          <div className="flex flex-wrap gap-12">
            <div className="scroll-rise flex flex-[2_1_360px] flex-col border-b border-line">
              {notes.map((n) => (
                <a key={n.title} href={n.href} className="group flex justify-between gap-4 border-t border-line px-3 py-5 transition-colors hover:bg-surface">
                  <span className="font-medium text-ink transition-colors group-hover:text-accent">{n.title}</span>
                  <span className="shrink-0 font-mono text-xs text-ink-3">{n.date}</span>
                </a>
              ))}
            </div>
            <div className="scroll-rise flex flex-[1_1_240px] flex-col gap-3">
              <h3 className="text-xl font-semibold text-ink">/uses</h3>
              <p className="text-[15px]">Editor and terminal, my Claude Code setup, self-hosted n8n, Forge, Vercel, and the Figma plugins I rely on.</p>
              <Link href="/uses" className="inline-flex min-h-11 items-center font-medium text-accent hover:text-accent-soft">
                See the setup →
              </Link>
            </div>
          </div>
        </Section>

        {/* Contact */}
        <section className="flex flex-col items-start gap-9 pt-40 pb-20">
          <h2 className="scroll-rise max-w-[1100px] text-[clamp(44px,7vw,112px)] leading-[0.95] font-semibold tracking-[-0.05em] text-ink">
            Still copying data by hand? <span className="text-ink-3">Let&apos;s fix that.</span>
          </h2>
          <div className="scroll-rise flex flex-wrap gap-3">
            <PrimaryButton href={`mailto:${site.email}`} size="lg">Start a project</PrimaryButton>
            <GhostButton href={site.bookingUrl} size="lg">Book a 20-minute call</GhostButton>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
