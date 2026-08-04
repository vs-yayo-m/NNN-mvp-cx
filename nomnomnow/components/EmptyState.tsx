import Link from "next/link";

export default function EmptyState({
  title,
  message,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full border border-line text-3xl">
        {"\u{1F962}"}
      </div>
      <h2 className="font-display text-lg font-semibold text-cream">{title}</h2>
      <p className="max-w-xs text-sm text-muted">{message}</p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="tap-scale focus-ring mt-2 rounded-full bg-chili px-5 py-2.5 text-sm font-semibold text-cream"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
