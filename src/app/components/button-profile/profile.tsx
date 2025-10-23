'use client';

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bell, Heart, FileText, User as UserIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type SectionKey = "profil" | "notifikasi" | "pengajuan" | "wishlist";

type UserMenuProps = {
  name: string;
  avatarUrl?: string;
};

export default function UserMenu({ name, avatarUrl }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const logout = () => {
    router.push("/"); // kembali ke landing
  };

  const goTo = (key: SectionKey) => {
    setOpen(false);
    router.push(`/akun?tab=${key}`); // sinkron dgn halaman /akun
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-3 rounded-full px-2 py-1 hover:bg-gray-100 transition"
      >
        <div className="relative h-9 w-9 rounded-full overflow-hidden bg-[#FF8500] text-white grid place-items-center font-bold">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={name} fill className="object-cover" />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <span className="hidden md:inline font-medium text-gray-800">{name}</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border p-2 z-[60]"
          >
            {/* Arrow */}
            <div className="absolute -top-2 right-8 h-4 w-4 rotate-45 bg-white border-l border-t" />

            <MenuButton onClick={() => goTo("profil")}     icon={<UserIcon className="h-4 w-4" />}>Profil</MenuButton>
            <MenuButton onClick={() => goTo("notifikasi")} icon={<Bell className="h-4 w-4" />}>Notifikasi</MenuButton>
            <MenuButton onClick={() => goTo("pengajuan")}  icon={<FileText className="h-4 w-4" />}>Pengajuan KPR</MenuButton>
            <MenuButton onClick={() => goTo("wishlist")}   icon={<Heart className="h-4 w-4" />}>Wishlist</MenuButton>

            <div className="my-1 h-px bg-gray-100" />

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({
  onClick, icon, children,
}: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-800 hover:bg-gray-50 active:bg-gray-100"
    >
      {icon}
      <span className="font-medium">{children}</span>
    </button>
  );
}
