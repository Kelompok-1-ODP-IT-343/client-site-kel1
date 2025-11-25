"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Bell,
  FileText,
  Heart,
  LogOut,
  User as UserIcon,
  ChevronRight,
} from "lucide-react";

import SidebarItem from "@/app/user/akun/SidebarItem";
import ProfilContent from "@/app/user/akun/ProfileContent";
import PengajuanKPRContent from "@/app/user/akun/PengajuanKPRContent";
import WishlistContent from "@/app/user/akun/WishlistContent";
import NotifikasiContent from "@/app/user/akun/NotifikasiContent";
import { Section } from "@/app/user/akun/types";
import { useAuth } from "@/app/lib/authContext";
import { USER_ROUTES } from "@/app/routes/userRoutes";

function AkunContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logout } = useAuth();

  const initialTab = (searchParams.get("tab") || "profil").toLowerCase();
  const [active, setActive] = useState<Section>(
    ["profil", "notifikasi", "pengajuan", "wishlist"].includes(
      initialTab as Section
    )
      ? (initialTab as Section)
      : "profil"
  );

  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("tab", active);
    router.push(`?${sp.toString()}`);
  }, [active]);

  useEffect(() => {
    const tab = (searchParams.get("tab") || "").toLowerCase();
    if (["profil", "notifikasi", "pengajuan", "wishlist"].includes(tab)) {
      setActive(tab as Section);
    }
  }, [searchParams]);

  const goLogout = () => {
    try {
      logout();
    } catch {}
    router.push(USER_ROUTES.BERANDA);
  };

  const sidebar = useMemo(
    () => [
      {
        key: "profil",
        label: "Profil",
        icon: <UserIcon className="h-5 w-5" />,
      },
      {
        key: "notifikasi",
        label: "Notifikasi",
        icon: <Bell className="h-5 w-5" />,
      },
      {
        key: "pengajuan",
        label: "Pengajuan KPR",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        key: "wishlist",
        label: "Favorit",
        icon: <Heart className="h-5 w-5" />,
      },
    ],
    []
  );

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            {sidebar.map((item) => (
              <SidebarItem
                key={item.key}
                active={active === (item.key as Section)}
                title={item.label}
                icon={item.icon}
                onClick={() => setActive(item.key as Section)}
              />
            ))}

            <div className="h-px bg-gray-100 mx-4" />
            <button
              onClick={goLogout}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 text-gray-700">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Keluar</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </aside>

        <section className="md:col-span-8 lg:col-span-9">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 space-y-12 min-h-[400px]">
            {active === "profil" && <ProfilContent />}
            {active === "notifikasi" && <NotifikasiContent />}
            {active === "pengajuan" && <PengajuanKPRContent />}
            {active === "wishlist" && <WishlistContent />}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AkunPage() {
  return (
    <Suspense fallback={null}>
      <AkunContent />
    </Suspense>
  );
}
