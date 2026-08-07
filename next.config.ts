// /next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allows MenuImage.tsx to render external stock/food-photo URLs via
    // next/image. Add any additional hosts here if you swap in your own
    // photography from a different provider. Local images placed in
    // /public/menu/ never need an entry here.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
