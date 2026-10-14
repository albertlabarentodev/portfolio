import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/site";
import { SiteFooter, SiteHeader } from "@/components/chrome";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary, openGraph: { images: [p.image] } } : {};
}

function Block({ index, label, children }: { index: string; label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-wrap gap-10 pt-24">
      <div className="label w-full sm:w-auto sm:max-w-60 sm:flex-[1_1_200px]">
        <span className="text-accent">{index}</span> · {label}
      </div>
      <div className="scroll-rise flex min-w-0 flex-[999_1_640px] flex-col gap-5">{children}</div>
    </section>
  );
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <div className="relative overflow-clip">
      <SiteHeader />

      <header className="mx-auto flex max-w-7xl flex-col gap-7 px-5 pt-10 pb-12 sm:px-10 sm:pt-16">
        <Link href="/#work" className="label group inline-flex min-h-11 items-center gap-2.5 self-start text-ink-2 hover:text-ink">
          <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">←</span> All work
        </Link>
        <div className="label animate-rise">Case study · {p.kicker}</div>
        <h1 className="text-[clamp(48px,7vw,108px)] leading-[0.96] font-semibold tracking-[-0.05em] text-ink">
          <span className="mask-line"><span>{p.title}</span></span>
        </h1>
        <p className="max-w-[640px] animate-rise text-[21px] [animation-delay:.3s]">{p.summary}</p>
        <dl className="mt-4 grid animate-rise grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 border-t border-line pt-7 [animation-delay:.45s]">
          {[
            ["Role", p.role],
            ["Client", p.client],
            ["Timeline", p.timeline],
            ["Stack", p.stack],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label text-[11px]">{k}</dt>
              <dd className="mt-1 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="mx-auto max-w-[1440px] px-3 sm:px-6">
        <figure className="m-0 overflow-hidden rounded-3xl border border-line bg-[#070b15]">
          <Image
            src={p.image}
            alt={p.imageAlt}
            width={1600}
            height={1000}
            priority
            sizes="100vw"
            className="block h-auto w-full animate-[zoom-in_1.4s_var(--ease-out-soft)_.3s_both]"
          />
        </figure>
      </div>

      <main className="mx-auto max-w-7xl px-5 pb-28 sm:px-10">
        <section className="scroll-rise grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] border-b border-line">
          <div className="py-12 pr-6">
            <div className="text-[52px] font-semibold tracking-[-0.04em] text-accent">{p.metric}</div>
            <div className="text-[15px] text-ink-3">{p.metricLabel}</div>
          </div>
        </section>

        <Block index="01" label="Problem">
          <p className="text-[clamp(24px,2.6vw,32px)] leading-[1.3] tracking-[-0.025em] text-ink">{p.problem}</p>
          <p>{p.context}</p>
        </Block>

        <Block index="02" label="What I built">
          <ol className="m-0 flex list-none flex-col border-t border-line p-0">
            {p.steps.map((s) => (
              <li key={s.label} className="flex flex-wrap gap-5 border-b border-line py-5">
                <span className="label flex-[0_0_140px] pt-1">{s.label}</span>
                <span className="flex-[1_1_320px] text-ink">{s.text}</span>
              </li>
            ))}
          </ol>
          {p.code && (
            <div className="overflow-hidden rounded-2xl border border-line bg-[#070b15]">
              <div className="flex justify-between border-b border-line px-4.5 py-3 font-mono text-xs text-ink-3">
                <span>{p.code.file}</span>
                <span>[Excerpt]</span>
              </div>
              <pre className="m-0 overflow-x-auto px-5.5 py-5 font-mono text-[15px] leading-[1.75] text-ink-2">{p.code.body}</pre>
            </div>
          )}
        </Block>

        <Block index="03" label="Design">
          <p>{p.design}</p>
        </Block>

        <Block index="04" label="Result">
          <p className="text-[26px] leading-[1.4] tracking-[-0.02em] text-ink">{p.result}</p>
        </Block>

        <nav aria-label="More case studies" className="mt-28 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-10">
          <Link href="/#work" className="inline-flex min-h-11 items-center font-medium text-accent hover:text-accent-soft">← All work</Link>
          <Link href={`/work/${next.slug}`} className="group flex flex-col items-end gap-1 text-ink">
            <span className="label">Next case study</span>
            <span className="text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.03em] transition-colors group-hover:text-accent">{next.title} →</span>
          </Link>
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
}
