// ============================================================================
// Footer — brand footer with real contact channels: WhatsApp, Instagram,
// TikTok, and the (in-progress) website. Hidden on mobile below the fold
// since the bottom nav owns that space; visible on desktop for a complete
// page feel. All icons are Lucide or the hand-built brand marks in
// components/icons/socialIcons.tsx — no emoji.
// ============================================================================

import Link from "next/link";
import { Phone, Globe } from "lucide-react";
import { InstagramIcon, TikTokIcon } from "@/components/icons/socialIcons";

const CONTACT = {
  whatsapp: "9779705059677", // +977 9705059677, no punctuation for wa.me links
  instagram: "https://www.instagram.com/nomnomnowbtl",
  tiktok: "https://vm.tiktok.com/ZS9hueB3Bu86H-KzHnn/",
  website: "nomnomnow.com.np",
};

const SOCIAL_LINKS = [
  { href: `https://wa.me/${CONTACT.whatsapp}`, label: "WhatsApp", Icon: Phone },
  { href: CONTACT.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: CONTACT.tiktok, label: "TikTok", Icon: TikTokIcon },
];

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-ink-100 bg-cream-100 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">Nom Nom Now</p>
          <p className="text-sm text-ink-400 mt-1">Restaurant · Cloud Kitchen · Bar — Butwal</p>
          <div className="flex items-center gap-1.5 mt-3 text-sm text-ink-500">
            <Globe className="h-3.5 w-3.5 text-ink-400" strokeWidth={2} aria-hidden />
            <span>{CONTACT.website}</span>
            <span className="text-xs text-ink-300">(coming soon)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-100 text-ink-600 hover:border-brand-300 hover:text-brand-500 transition-colors"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
        </div>

        <p className="text-xs text-ink-400">
          © {new Date().getFullYear()} Nom Nom Now. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
