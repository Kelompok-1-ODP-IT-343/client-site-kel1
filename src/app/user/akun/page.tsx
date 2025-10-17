"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import {
  User as UserIcon,
  Bell,
  FileText,
  Heart,
  LogOut,
  ChevronRight,
  MapPin,
} from "lucide-react";

// Tidak perlu lagi import Header atau Footer di sini jika sudah ada di layout

type Section = "profil" | "notifikasi" | "pengajuan" | "wishlist";

export default function AkunPage() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<Section>("notifikasi");
  const router = useRouter();

  useEffect(() => {
    const tab = (searchParams.get("tab") || "").toLowerCase();
    if (["profil", "notifikasi", "pengajuan", "wishlist"].includes(tab)) {
      setActive(tab as Section);
    }
  }, [searchParams]);

  const goLogout = () => router.push("/");

  return (
    // Div pembungkus luar dan <header> lokal sudah dihapus
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
        {/* SIDEBAR */}
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="rounded-2xl bg-white border shadow-sm overflow-hidden">
            <SidebarItem active={active === "profil"} title="Profil" icon={<UserIcon className="h-5 w-5" />} onClick={() => setActive("profil")} />
            <SidebarItem active={active === "notifikasi"} title="Notifikasi" icon={<Bell className="h-5 w-5" />} onClick={() => setActive("notifikasi")} />
            <SidebarItem active={active === "pengajuan"} title="Pengajuan KPR" icon={<FileText className="h-5 w-5" />} onClick={() => setActive("pengajuan")} />
            <SidebarItem active={active === "wishlist"} title="Wishlist" icon={<Heart className="h-5 w-5" />} onClick={() => setActive("wishlist")} />

            <div className="h-px bg-gray-100 mx-4" />
            <button onClick={goLogout} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition">
              <div className="flex items-center gap-3 text-gray-700">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Keluar</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="md:col-span-8 lg:col-span-9">
          <div className="rounded-2xl bg-white border shadow-sm p-6 space-y-12 min-h-[400px]">
            {active === "profil" && <ProfilContent />}
            {active === "notifikasi" && <NotifikasiContent />}
            {active === "pengajuan" && <PengajuanContent />}
            {active === "wishlist" && <WishlistContent />}
          </div>
        </section>
      </div>
    </main>
  );
}

/* Sidebar Item */
function SidebarItem({ title, icon, onClick, active }: { title: string; icon: ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-4 transition ${
        active ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <div className={`flex items-center gap-3 ${active ? "text-blue-600" : "text-gray-800"}`}>
        <div className={`h-9 w-9 grid place-items-center rounded-xl ${active ? "bg-blue-100" : "bg-gray-100"}`}>
          {icon}
        </div>
        <span className="font-semibold">{title}</span>
      </div>
      <ChevronRight className={`h-4 w-4 ${active ? "text-blue-600" : "text-gray-400"}`} />
    </button>
  );
}

/* Content Components */
function ProfilContent() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Profil</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nama" value="chipmunk depok" />
        <Field label="Email" value="user@email.com" />
      </div>
    </div>
  );
}

function NotifikasiContent() {
  return <p className="text-gray-500">Belum ada notifikasi.</p>;
}

function PengajuanContent() {
  return <p className="text-gray-500">Belum ada pengajuan KPR.</p>;
}

function WishlistContent() {
    // Logika WishlistContent tetap sama
    const [wishlist, setWishlist] = useState<any[]>([]);

    useEffect(() => {
        // Dummy data, di aplikasi nyata Anda akan fetch ini
        const allHouses = [
            { id: 1, name: "Cluster Green Valley", location: "Serpong, Banten", price: "Rp 1.500.000.000", image: "/rumah-1.jpg" },
            { id: 2, name: "Rumah Klasik Menteng", location: "Jakarta Pusat", price: "Rp 25.000.000.000", image: "/rumah-2.jpg" },
        ];
        // Simulasi mengambil wishlist dari localStorage
        const savedIds = [1]; // Anggap user menyimpan rumah dengan id 1
        setWishlist(allHouses.filter(h => savedIds.includes(h.id)));
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Wishlist</h2>
            {wishlist.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada rumah di wishlist kamu.</p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((house) => (
                        <div key={house.id} className="rounded-xl border p-4 hover:shadow-md transition bg-white">
                            <div className="h-32 bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                                <Image src={house.image} alt={house.name} fill className="object-cover" />
                            </div>
                            <p className="font-semibold text-gray-800 truncate">{house.name}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                                <MapPin size={14} className="mr-1" /> {house.location}
                            </p>
                            <p className="text-sm text-orange-600 font-bold mt-1">{house.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* Helpers */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-500 mb-1">{label}</span>
      <input
        defaultValue={value}
        className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}