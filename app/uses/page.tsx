import type { Metadata } from "next";
import { uses } from "@/content/site";
import { SiteFooter, SiteHeader } from "@/components/chrome";

export const metadata: Metadata = { title: "Uses", description: "The tools and setup I build with." };

export default function Uses() {
  return (
    <div className="relative overflow-clip">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-12 px-5 pt-16 pb-28 sm:px-10">
        <div className="flex flex-col gap-4">
          <div className="label animate-rise">/uses</div>
          <h1 className="text-[clamp(44px,6vw,72px)] leading-none font-semibold tracking-[-0.045em] text-ink">
            <span className="mask-line"><span>What I build with.</span></span>
          </h1>
        </div>
        {uses.map((g) => (
          <section key={g.group} className="scroll-rise flex flex-col">
            <h2 className="label border-b border-line pb-3">{g.group}</h2>
            {g.items.map((item) => (
              <p key={item} className="border-b border-line py-4 text-ink">{item}</p>
            ))}
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
