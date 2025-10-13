import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    turbo: {
      resolveAlias: {
        // memastikan turbo build kompatibel jika diperlukan
      },
    },
  },
};

export default nextConfig;
