"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import Image from "next/image"; // 1. Tambahkan import Image

// Asumsi path ini sudah benar
import { USER_ROUTES } from "@/app/routes/userRoutes";

// Daftar item navigasi
const navItems = [
  { href: USER_ROUTES.BERANDA, label: "Beranda" },
  { href: USER_ROUTES.CARI_RUMAH, label: "Cari Rumah" },
  { href: USER_ROUTES.SIMULASI, label: "Simulasi" },
];

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative py-2 text-gray-700 font-semibold transition-colors duration-300 hover:text-bni-teal ${
        isActive ? "text-bni-teal" : ""
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-bni-orange"></span>
      )}
    </Link>
  );
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 2. Ganti blok logo "BNI KPR" dengan logo "SatuAtap" */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-[170px] h-[40px]">
              <Image
                src="/logo_header.png"
                alt="SatuAtap Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Tombol Autentikasi */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={USER_ROUTES.LOGIN}
               className="border border-black text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-black hover:text-white transition-all duration-300"
             >
              Masuk
            </Link>
            <Link
              href={USER_ROUTES.REGISTER}
              className="bg-bni-orange text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-orange-600 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Daftar
            </Link>
          </div>

          {/* Tombol Menu Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-bni-teal transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Konten Menu Mobile */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-lg md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <div className="flex flex-col px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-3 text-gray-700 font-medium rounded-md hover:bg-gray-100 hover:text-bni-teal"
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-gray-200 pt-4 mt-2 px-4 flex flex-col gap-3">
            <Link
              href={USER_ROUTES.LOGIN}
              className="border border-bni-teal text-bni-teal py-2.5 rounded-lg text-center font-bold hover:bg-bni-teal hover:text-white transition-colors duration-300"
            >
              Masuk
            </Link>
            <Link
              href={USER_ROUTES.REGISTER}
              className="bg-bni-orange text-white py-2.5 rounded-lg text-center font-bold hover:bg-orange-600 transition-colors duration-300"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}