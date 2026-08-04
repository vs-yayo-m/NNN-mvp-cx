// ============================================================================
// Footer — simple brand footer. Hidden on mobile below the fold since the
// bottom nav owns that space; visible on desktop for a complete page feel.
// ============================================================================

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-ink-100 bg-cream-100 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">Nom Nom Now</p>
          <p className="text-sm text-ink-400 mt-1">Restaurant · Cloud Kitchen · Bar — Butwal</p>
        </div>
        <p className="text-xs text-ink-400">
          © {new Date().getFullYear()} Nom Nom Now. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
