// detail rumah

"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

const COLORS = {
  orange: "#FF8500",
  lime: "#DDEE59",
  teal: "#3FD8D4",
  blue: "#C5F3F3",
  gray: "#757575",
};

export default function DetailRumahPage() {
  const property = {
    name: "Cluster Green Valley",
    developer: "PT Properti Sejahtera",
    location: "Serpong, Tangerang Selatan",
    unitType: "45/72",
    price: "Rp 750.000.000",
    status: "Tersedia",
    image: "/rumah-1.png",
    mapsQuery: "Serpong, Tangerang Selatan",
    description:
      "Hunian nyaman dengan akses mudah ke fasilitas publik, lingkungan hijau, dan desain modern cocok untuk keluarga muda.",
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    property.mapsQuery
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <Image src="/logo-satuatap.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-extrabold text-xl text-[#FF8500]">satuatap</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium">
            <Link href="/" className="text-gray-700 hover:text-[#FF8500]">Beranda</Link>
            <Link href="/user/cari-rumah" className="text-gray-700 hover:text-[#FF8500]">Cari Rumah</Link>
            <Link href="/user/simulasi" className="text-gray-700 hover:text-[#FF8500]">Simulasi</Link>
          </nav>

          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 rounded-full text-white text-sm shadow-md hover:shadow-lg transition"
            style={{ backgroundColor: "#0f766e" }}
          >
            Login
          </button>
        </div>
      </header>

      {/* TITLE */}
      <section className="py-10" style={{ backgroundColor: COLORS.blue }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Detail Rumah</h1>
          <p className="text-gray-700 mt-2">Informasi lengkap properti yang dipilih.</p>
        </div>
      </section>

      {/* INFORMASI PROPERTI */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kartu gambar kiri */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="relative h-72 w-full">
              <Image src={property.image} alt={property.name} fill className="object-cover" />
            </div>
            <div className="p-4 space-y-3">
              <h3 className="text-xl font-bold text-gray-900">{property.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-extrabold text-lg">{property.price}</span>
                <div className="flex gap-3">
                  <Link
                    href="/user/pengajuan"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-900 shadow hover:opacity-90 transition"
                    style={{ backgroundColor: COLORS.orange }}
                  >
                    Ajukan
                  </Link>
                  <Link
                    href="/user/simulasi"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-900 shadow hover:opacity-90 transition"
                    style={{ backgroundColor: COLORS.lime }}
                  >
                    Simulasi
                  </Link>
                </div>
              </div>
              <div className="text-sm">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#0f766e] hover:text-[#085e56]"
                >
                  Lihat di Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Tabel detail kanan */}
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">Informasi Properti</h2>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: COLORS.teal, color: "#083344" }}
              >
                {property.status}
              </span>
            </div>
            <div className="px-6 pt-6 text-sm text-gray-700">
              <h3 className="font-semibold mb-2">Deskripsi</h3>
              <p>{property.description}</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div className="text-gray-500">Nama Properti</div>
              <div className="font-semibold text-gray-900">{property.name}</div>

              <div className="text-gray-500">Developer</div>
              <div className="font-semibold text-gray-900">{property.developer}</div>

              <div className="text-gray-500">Lokasi</div>
              <div className="font-semibold text-gray-900">{property.location}</div>

              <div className="text-gray-500">Tipe Unit</div>
              <div className="font-semibold text-gray-900">{property.unitType}</div>

              <div className="text-gray-500">Harga Properti</div>
              <div className="font-semibold text-gray-900">{property.price}</div>

              <div className="text-gray-500">Status Unit</div>
              <div className="font-semibold text-gray-900">{property.status}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto text-white" style={{ backgroundColor: COLORS.orange }}>
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-sm/6 text-white/90">
              PT Bank Negara Indonesia (Persero) Tbk adalah bank BUMN terbesar di Indonesia.
              Kami berkomitmen memberikan layanan KPR terbaik untuk mewujudkan impian rumah Anda.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Layanan</h4>
            <ul className="space-y-2 text-sm/6 text-white/90">
              <li><Link href="/user/cari-rumah" className="hover:opacity-80">Cari Rumah</Link></li>
              <li><Link href="/user/simulasi" className="hover:opacity-80">Simulasi</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Hubungi Kami</h4>
            <ul className="text-sm/6 space-y-2 text-white/90">
              <li>1500046</li>
              <li>kpr@bni.co.id</li>
              <li>🏢 Jl. Jenderal Sudirman Kav. 1 Jakarta Pusat 10220</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}