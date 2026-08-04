import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { SITE } from "@/data/site-config";

// Font stack note: this environment cannot reach Google Fonts at build time,
// so we ship curated system-font stacks with an equivalent personality
// (serif display / humanist sans body / monospace for prices & order IDs).
// Swap these for next/font/google (Fraunces, Inter, IBM Plex Mono) once
// deployed to Vercel, where Google Fonts is reachable at build time.
const fontVars = {
  "--font-fraunces": "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif",
  "--font-inter": "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  "--font-mono": "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace",
} as React.CSSProperties;

export const metadata: Metadata = {
  title: `${SITE.name} \u2014 ${SITE.tagline}`,
  description: `Order food and drinks from ${SITE.name}, ${SITE.branch}. Kitchen, bar and cloud kitchen, delivered.`,
};

export const viewport: Viewport = {
  themeColor: "#12100E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={fontVars}>
      <body className="font-body bg-base text-cream antialiased">
        <AppProvider>
          <Header />
          <main className="min-h-[70vh] pb-24">{children}</main>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
