import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { site } from "@/content/site";

import "./globals.css";

/**
 * `display: "swap"` keeps text painted during font load, which is what keeps
 * this off Lighthouse's render-blocking list. next/font self-hosts the file, so
 * there is no third-party connection on the critical path.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
