// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   output: "standalone",
//   experimental: {
//     turbo: {
//       resolveAlias: {
//         // memastikan turbo build kompatibel jika diperlukan
//       },
//     },
//   },
// };

// export default nextConfig;

// import type { NextConfig } from "next";

// /** @type {import('next').NextConfig} */
// const nextConfig: NextConfig = {
//   // ✅ Allow external image domain
//   images: {
//     domains: ["is3.cloudhost.id"],
//   },

//   // ✅ Ignore eslint errors during production build
//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   // ✅ Use standalone output (for Docker deployment, etc.)
//   output: "standalone",

//   // ✅ Turbo mode config (for faster build)
//   experimental: {
//     turbo: {
//       resolveAlias: {
//         // memastikan turbo build kompatibel jika diperlukan
//       },
//     },
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

/**
 * ✅ Next.js Configuration
 * - Mengizinkan pemuatan gambar eksternal dari domain tertentu
 * - Mengabaikan error ESLint saat proses build (untuk CI/CD)
 * - Menggunakan mode standalone (cocok untuk Docker)
 * - Mengaktifkan Turbo build untuk performa lebih cepat
 */
const nextConfig: NextConfig = {
  // ✅ Allow external image domains
  images: {
    domains: ["is3.cloudhost.id"], // Gambar dari cloudhost.id diizinkan
  },

  // ✅ Ignore eslint warnings during production build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Standalone output (berguna untuk deployment Docker)
  output: "standalone",

  // ✅ Experimental Turbo mode (optional untuk Next.js 15+)
  experimental: {
    turbo: {
      resolveAlias: {
        // Tambahkan alias custom jika dibutuhkan nanti
      },
    },
  },
};

export default nextConfig;
