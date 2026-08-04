"use client";

// ============================================================================
// MenuImage — the single place that knows how to render a menu item's image,
// whether it's a full external URL ("https://...") or a local path
// ("/menu/xyz.jpg" served from /public/menu/). Always falls back to a
// branded placeholder on load failure so a bad URL never breaks the demo.
// Call sites never need to know which kind of path they were given.
// ============================================================================

import { useState } from "react";
import Image from "next/image";

interface MenuImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function MenuImage({ src, alt, className = "", sizes, priority }: MenuImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-brand-100 to-gold-50 text-brand-500 ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-3xl" aria-hidden>
          🍽️
        </span>
      </div>
    );
  }

  // Both external URLs and local /public paths work transparently through
  // next/image as long as the host is allow-listed in next.config.ts.
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
      priority={priority}
      className={`object-cover ${className}`}
      onError={() => setErrored(true)}
    />
  );
}
