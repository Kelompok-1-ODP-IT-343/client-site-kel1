// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bni-orange': '#f6821f', // Oranye utama BNI
        'bni-teal': '#00a19d',   // Teal/Turquoise BNI
        'bni-orange-solid': '#FF8D28',
        'brand-lime': '#DDEE59',
        'brand-bg-light': '#F0FAF9',
    },
    },
  },
  plugins: [],
};
export default config;