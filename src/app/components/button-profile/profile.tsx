"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Bell, FileText, Heart, LogOut } from "lucide-react";
import { USER_ROUTES } from "@/app/routes/userRoutes";
import { useAuth } from "@/app/lib/authContext";
import { API_BASE_URL } from "@/app/lib/apiConfig";

function getOriginFromBase(base?: string) {
  try {
    return base ? new URL(base).origin : "";
  } catch {
    return "";
  }
}

function normalizePhotoUrl(src?: string | null) {
  if (!src) return null;
  const s = src.trim();
  if (!s) return null;

  if (/^(https?:)?\/\//i.test(s) || s.startsWith("data:")) return s;

  if (s.startsWith("/")) return s;

  const apiOrigin = getOriginFromBase(API_BASE_URL);
  return `/${s}`;
}

function getInitials(fullName?: string) {
  if (!fullName) return "U";
  const parts = fullName.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "U";
}

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safePhoto = useMemo(
    () => normalizePhotoUrl(user.photoUrl),
    [user?.photoUrl]
  );
  const [imgOk, setImgOk] = useState(true);
  useEffect(() => setImgOk(true), [safePhoto]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-50 transition"
      >
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-bni-orange text-white grid place-items-center font-bold">
          {safePhoto && imgOk ? (
            <Image
              src={safePhoto}
              alt="Foto Profil"
              width={36}
              height={36}
              className="rounded-full object-cover w-full h-full"
              onError={() => setImgOk(false)}
              priority={false}
            />
          ) : (
            <span>{getInitials(user.fullName)}</span>
          )}
        </div>
        <span className="hidden md:inline font-semibold text-gray-800">
          {user.fullName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-white border rounded-2xl shadow-lg z-50 p-2">
          <DropdownButton
            icon={<User size={18} />}
            label="Profil"
            onClick={() => {
              router.push(`${USER_ROUTES.AKUN}?tab=profil`);
              setOpen(false);
            }}
          />
          <DropdownButton
            icon={<Bell size={18} />}
            label="Notifikasi"
            onClick={() => {
              router.push(`${USER_ROUTES.AKUN}?tab=notifikasi`);
              setOpen(false);
            }}
          />
          <DropdownButton
            icon={<FileText size={18} />}
            label="Pengajuan KPR"
            onClick={() => {
              router.push(`${USER_ROUTES.AKUN}?tab=pengajuan`);
              setOpen(false);
            }}
          />
          <DropdownButton
            icon={<Heart size={18} />}
            label="Wishlist"
            onClick={() => {
              router.push(`${USER_ROUTES.AKUN}?tab=wishlist`);
              setOpen(false);
            }}
          />

          <hr className="my-2" />

          <button
            onClick={() => {
              logout();
              router.push(USER_ROUTES.BERANDA);
            }}
            className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-xl text-red-600 font-medium"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}

function DropdownButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-xl text-gray-800"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
