"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";
import Image from "next/image";
import { USER_ROUTES } from "@/app/routes/userRoutes";
import UserMenu from "@/app/components/button-profile/profile";
import { useAuth } from "@/app/lib/authContext";

const navItems = [
  { href: USER_ROUTES.BERANDA, label: "Beranda" },
  { href: USER_ROUTES.CARI_RUMAH, label: "Cari Rumah" },
  { href: USER_ROUTES.SIMULASI, label: "Simulasi" },
  { href: USER_ROUTES.TENTANG_KAMI, label: "Tentang Kami" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => setIsMenuOpen(false), [pathname]);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-[170px] h-[40px]">
              <Image src="/logo_header.png" alt="SatuAtap Logo" fill className="object-contain" />
            </div>
          </Link>

          {/* Navigasi */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 font-semibold text-gray-700 hover:text-bni-teal ${
                  pathname === item.href ? "text-bni-teal" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Login/Profil */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  href={USER_ROUTES.LOGIN}
                  className="border border-black text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-black hover:text-white transition-all duration-300"
                >
                  Masuk
                </Link>
                <Link
                  href={USER_ROUTES.REGISTER}
                  className="bg-bni-orange text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-orange-600 shadow-md transition-all duration-300"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Menu Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-bni-teal"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
}
