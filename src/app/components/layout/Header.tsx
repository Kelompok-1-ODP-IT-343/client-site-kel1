"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X, Menu } from "lucide-react";
import Image from "next/image";
import { USER_ROUTES } from "@/app/routes/userRoutes";
import UserMenu from "@/app/components/button-profile/profile";
import { useAuth } from "@/app/lib/authContext";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: USER_ROUTES.BERANDA, label: "Beranda" },
  { href: USER_ROUTES.CARI_RUMAH, label: "Cari Rumah" },
  { href: USER_ROUTES.SIMULASI, label: "Simulasi" },
  { href: USER_ROUTES.TENTANG_KAMI, label: "Tentang Kami" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const pathname = usePathname();
  const { user } = useAuth();
  const lastY = useRef(0);

  useEffect(() => setIsMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y <= 10);
      if (y > lastY.current && y > 80) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        y: hidden ? -80 : 0,
        boxShadow: !atTop
          ? "0 6px 18px rgba(231, 15, 15, 0.07)"
          : "0 0 0 rgba(0, 0, 0, 0)",
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white sticky top-0 z-50 w-full transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="flex items-center gap-2 transform transition-transform hover:scale-[1.03]"
          >
            <div className="relative w-[170px] h-[40px]">
              <Image
                src="/logo_header.png"
                alt="SatuAtap Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative py-2 font-semibold text-gray-700 transition-all duration-200 hover:text-bni-teal"
                >
                  <span
                    className={`transition-colors ${
                      active ? "text-bni-teal" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`absolute left-0 -bottom-0.5 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-bni-orange via-bni-teal to-bni-orange transition-transform duration-300 group-hover:scale-x-100 ${
                      active ? "scale-x-100" : ""
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  href={USER_ROUTES.LOGIN}
                  className="relative overflow-hidden border border-gray-800 text-black px-5 py-2 rounded-full font-bold text-sm group transition-all duration-200 hover:text-white bg-"
                >
                  <span className="absolute inset-0 bg-gray-800 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-full" />
                  <span className="relative z-10 group-hover:text-white">
                    Masuk
                  </span>
                </Link>
                <Link
                  href={USER_ROUTES.REGISTER}
                  className="bg-bni-orange text-white px-5 py-2 rounded-full font-bold text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px] hover:brightness-110"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen((s) => !s)}
            className="md:hidden p-2 text-gray-700 hover:text-bni-teal transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "bg-bni-teal/10 text-bni-teal"
                        : "text-gray-700 hover:bg-gray-100 hover:text-bni-teal"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="h-[1px] bg-gray-200 my-2" />
              {user ? (
                <UserMenu />
              ) : (
                <div className="flex gap-2">
                  <Link
                    href={USER_ROUTES.LOGIN}
                    className="flex-1 border border-gray-700 text-gray-800 px-3 py-2 rounded-lg font-bold text-sm text-center hover:bg-gray-800 hover:text-white transition-all"
                  >
                    Masuk
                  </Link>
                  <Link
                    href={USER_ROUTES.REGISTER}
                    className="flex-1 bg-bni-orange text-white px-3 py-2 rounded-lg font-bold text-sm text-center hover:opacity-90 transition-opacity"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
