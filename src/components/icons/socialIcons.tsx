// ============================================================================
// socialIcons.tsx — minimal, faithful SVG marks for Instagram and TikTok.
// Lucide intentionally doesn't ship trademarked brand logos, so these are
// hand-built to match the official glyphs closely enough for a footer/
// contact context, kept as simple single-color strokes/fills so they match
// the rest of the icon system rather than looking like pasted-in brand art.
// ============================================================================

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M16.5 3c.4 2.2 1.9 3.8 4.1 4.1v3c-1.5 0-2.9-.4-4.1-1.2v6.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.1a2.5 2.5 0 1 0 1.8 2.4V3h2.9Z"
        fill="currentColor"
      />
    </svg>
  );
}
