import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "is3.cloudhost.id",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  output: "standalone",

  // Configure Turbopack and root to avoid mis-detected workspace root
  turbopack: {
    root: __dirname,
    resolveAlias: {},
  },
  async rewrites() {
    // Proxy backend API to avoid browser CORS during local/dev and production
    // If NEXT_PUBLIC_API_PROXY_TARGET is provided, use it; otherwise default to local-dev domain
    const target =
      process.env.NEXT_PUBLIC_API_PROXY_TARGET || "https://satuatap.my.id";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${target}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
