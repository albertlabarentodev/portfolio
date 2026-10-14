import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { site } from "@/content/site";
import { SoundProvider } from "@/components/sound";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { default: `${site.name} · Full-stack engineer`, template: `%s · ${site.name}` },
  description:
    "Laravel and Next.js products, wired to your CRM, inbox and team chat with n8n and Claude.",
  openGraph: {
    title: `${site.name} · Full-stack engineer`,
    description: "I build the app, then automate everything around it.",
    images: ["/images/lead-intake.png"],
  },
};

export const viewport: Viewport = { themeColor: "#0a0f1c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
