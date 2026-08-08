import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cheers.com.np",
      },
      {
        protocol: "https",
        hostname: "jslight.com.np",
      },
    ],
  },
};

export default nextConfig;