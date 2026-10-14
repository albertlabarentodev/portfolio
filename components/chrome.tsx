import Link from "next/link";
import { site } from "@/content/site";
import { SoundToggle } from "./sound";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-block transition-transform duration-300 ease-out-soft ${className}`}>
      →
    </span>
  );
}

export function PrimaryButton({ href, children, size = "md" }: { href: string; children: React.ReactNode; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "min-h-11 px-[18px] text-[15px] rounded-full",
    md: "min-h-[52px] px-6 rounded-xl",
    lg: "min-h-14 px-7 text-lg rounded-[14px]",
  };
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2.5 bg-accent font-semibold text-accent-ink transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:bg-accent-soft ${sizes[size]}`}
    >
      {children} <Arrow className="group-hover:translate-x-1" />
    </a>
  );
}

export function GhostButton({ href, children, size = "md" }: { href: string; children: React.ReactNode; size?: "md" | "lg" }) {
  const sizes = { md: "min-h-[52px] px-6 rounded-xl", lg: "min-h-14 px-7 text-lg rounded-[14px]" };
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 border border-line-strong font-medium text-ink transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-accent ${sizes[size]}`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="relative mx-auto flex max-w-7xl animate-fade flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-10">
      <Link href="/" aria-label={`${site.name}, home`} className="flex min-h-11 items-center gap-3 text-ink">
        <span className="flex size-9 items-center justify-center rounded-[10px] border border-line-strong font-mono text-[13px] font-medium">
          {site.initials}
        </span>
        <span className="font-medium">{site.name}</span>
      </Link>
      <nav aria-label="Primary" className="order-3 flex w-full flex-wrap gap-7 text-[15px] sm:order-none sm:w-auto">
        {[
          ["Work", "/#work"],
          ["Lab", "/#lab"],
          ["About", "/#about"],
          ["Ask my AI", "/#ask"],
        ].map(([label, href]) => (
          <Link key={href} href={href} className="link-underline py-3 text-ink-2">
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2.5">
        <SoundToggle />
        <PrimaryButton href={`mailto:${site.email}`} size="sm">
          Start a project
        </PrimaryButton>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-5 py-7 text-sm text-ink-3 sm:px-10">
        <span>Designed in Figma. Built with Next.js and Tailwind on Vercel. Assistant powered by Claude.</span>
        <span className="flex gap-5">
          <a className="text-accent hover:text-accent-soft" href={site.github}>GitHub</a>
          <a className="text-accent hover:text-accent-soft" href={site.linkedin}>LinkedIn</a>
          <a className="text-accent hover:text-accent-soft" href={`mailto:${site.email}`}>Email</a>
        </span>
      </div>
    </footer>
  );
}

// Numbered label on the left, content on the right (Brittany Chiang reference).
export function Section({ id, index, label, children, className = "" }: { id?: string; index: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`flex scroll-mt-8 flex-wrap gap-10 pt-24 sm:pt-32 ${className}`}>
      <div className="w-full sm:w-auto sm:max-w-60 sm:flex-[1_1_200px]">
        <div className="label sticky top-8">
          <span className="text-accent">{index}</span> · {label}
        </div>
      </div>
      <div className="min-w-0 flex-[999_1_640px]">{children}</div>
    </section>
  );
}
