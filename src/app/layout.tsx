// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Sesuaikan path import jika komponen Anda berada di folder lain
import Header from "@/app/components/layout/Header"; 
import Footer from "@/app/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BNI KPR - Wujudkan Rumah Impian",
  description: "Platform pengajuan KPR BNI yang mudah dan cepat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          {/* Konten utama halaman akan dirender di sini */}
          <main className="flex-grow bg-gray-50">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}