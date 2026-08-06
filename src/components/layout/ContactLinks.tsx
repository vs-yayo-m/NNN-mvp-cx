// ============================================================================
// ContactLinks — WhatsApp / Instagram / TikTok row, used on the Profile page
// so these are reachable on mobile (the full Footer with the same links is
// desktop-only). Shares the same brand icon set as Footer.tsx.
// ============================================================================

import Link from "next/link";
import { Phone } from "lucide-react";
import { InstagramIcon, TikTokIcon } from "@/components/icons/socialIcons";

const CONTACT = {
  whatsapp: "9779705059677",
  instagram: "https://www.instagram.com/nomnomnowbtl",
  tiktok: "https://vm.tiktok.com/ZS9hueB3Bu86H-KzHnn/",
};

const LINKS = [
  { href: `https://wa.me/${CONTACT.whatsapp}`, label: "WhatsApp", Icon: Phone },
  { href: CONTACT.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: CONTACT.tiktok, label: "TikTok", Icon: TikTokIcon },
];

export default function ContactLinks() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Get in Touch</p>
      <div className="flex items-center gap-2">
        {LINKS.map(({ href, label, Icon }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-ink-100 bg-cream-100 px-3.5 py-2 text-sm text-ink-600 hover:border-brand-300 hover:text-brand-500 transition-colors"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
