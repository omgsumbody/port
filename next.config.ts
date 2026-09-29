import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Case-study screenshots are huge PNGs; serve them as modern formats at display size.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
