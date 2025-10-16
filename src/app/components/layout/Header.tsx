"use client";
import Link from "next/link";
import { useState } from "react";
import { USER_ROUTES } from "@/app/routes/userRoutes";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: USER_ROUTES.BERANDA, label: "Beranda" },
    { href: USER_ROUTES.CARI_RUMAH, label: "Cari Rumah" },
    { href: USER_ROUTES.SIMULASI, label: "Simulasi" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER BAR */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-[#FF8500]">BNI</div>
            <span className="text-sm text-gray-600 font-medium">KPR</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                className="text-gray-700 hover:text-[#0f766e] font-medium transition"
              >
                {nav.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={USER_ROUTES.LOGIN}
              className="border border-[#0f766e] text-[#0f766e] px-4 py-1.5 rounded-full font-medium hover:bg-[#0f766e] hover:text-white transition"
            >
              Masuk
            </Link>
            <Link
              href={USER_ROUTES.REGISTER}
              className="bg-[#FF8500] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#e96e00] transition"
            >
              Daftar
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#0f766e]"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-2">
            {navItems.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                className="block px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 hover:text-[#0f766e]"
                onClick={() => setIsMenuOpen(false)}
              >
                {nav.label}
              </Link>
            ))}
            <div className="px-4 py-3 flex flex-col gap-2">
              <Link
                href={USER_ROUTES.LOGIN}
                className="border border-[#0f766e] text-[#0f766e] py-2 rounded-lg text-center hover:bg-[#0f766e] hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Masuk
              </Link>
              <Link
                href={USER_ROUTES.REGISTER}
                className="bg-[#FF8500] text-white py-2 rounded-lg text-center hover:bg-[#e96e00] transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Daftar
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
