// ❌ JANGAN pakai "use client" di file ini

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProviderWrapper } from "@/app/providers/AuthProviderWrapper"; // ✅ tambahan wrapper client
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BNI KPR - Wujudkan Rumah Impian",
  description: "Platform pengajuan KPR BNI yang mudah dan cepat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* ✅ Bungkus di Client Provider terpisah */}
        <AuthProviderWrapper>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-gray-50">{children}</main>
            <Footer />
          </div>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
