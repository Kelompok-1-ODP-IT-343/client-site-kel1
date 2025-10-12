// cari rumah

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

const COLORS = {
  orange: "#FF8500",
  lime: "#DDEE59",
  teal: "#3FD8D4",
  blue: "#C5F3F3",
  gray: "#757575",
};

export default function CariRumahPage() {
  const [nameFilter, setNameFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");

  const houses = [
    {
      id: 1,
      name: "Cluster Green Valley",
      location: "Serpong, Banten",
      price: "Rp 1.500.000",
      image: "/images/rumah1.jpg",
    },
    {
      id: 2,
      name: "Cluster Green Valley",
      location: "Serpong, Banten",
      price: "Rp 1.500.000",
      image: "/images/rumah1.jpg",
    },
    {
      id: 3,
      name: "Cluster Green Valley",
      location: "Serpong, Banten",
      price: "Rp 1.500.000",
      image: "/images/rumah1.jpg",
    },
    {
      id: 4,
      name: "Cluster Green Valley",
      location: "Serpong, Banten",
      price: "Rp 1.500.000",
      image: "/images/rumah1.jpg",
    },
    {
      id: 5,
      name: "Cluster Green Valley",
      location: "Serpong, Banten",
      price: "Rp 1.500.000",
      image: "/images/rumah1.jpg",
    },
    {
      id: 6,
      name: "Cluster Green Valley",
      location: "Serpong, Banten",
      price: "Rp 1.500.000",
      image: "/images/rumah1.jpg",
    },
  ];

  const locationOptions = Array.from(new Set(houses.map(h => h.location)));
  const typeOptions = ["Cluster", "Apartemen", "Rumah Tinggal"];
  const budgetOptions = [
    "< 1.000.000.000",
    "1.000.000.000 - 2.000.000.000",
    "> 2.000.000.000",
  ];

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
            <Link href="/" className="text-gray-700 hover:text-[#FF8500]">
              Beranda
            </Link>
            <Link href="/cari-rumah" className="text-gray-700 hover:text-[#FF8500] border-b-2 border-[#FF8500] pb-1">
              Cari Rumah
            </Link>
            <Link href="/simulasi" className="text-gray-700 hover:text-[#FF8500]">
              Simulasi
            </Link>
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

      {/* HERO */}
      <section className="py-12" style={{ backgroundColor: COLORS.blue }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Eksplor Rumah Impian
          </h1>

          {/* Search Filters (label + 1 input ketik + 3 dropdown) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Cari Rumah</label>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Nama Rumah Impianmu"
                className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3FD8D4]"
              />
            </div>
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Lokasi</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3FD8D4]"
              >
                <option value="">Semua Lokasi</option>
                {locationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Tipe</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3FD8D4]"
              >
                <option value="">Semua Tipe</option>
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Rentang Harga</label>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3FD8D4]"
              >
                <option value="">Semua Budget</option>
                {budgetOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* GRID RUMAH */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {houses.map((house) => (
            <div
              key={house.id}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={house.image}
                  alt={house.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg">{house.name}</h3>
                <p className="flex items-center text-gray-600 mt-1 text-sm">
                  <MapPin size={16} className="mr-1" /> {house.location}
                </p>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {house.price}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    className="flex-1 py-2 rounded-lg font-semibold text-sm text-gray-900 shadow hover:opacity-90 transition"
                    style={{ backgroundColor: COLORS.orange }}
                  >
                    Ajukan
                  </button>
                  <button
                    className="flex-1 py-2 rounded-lg font-semibold text-sm text-gray-900 shadow hover:opacity-90 transition"
                    style={{ backgroundColor: COLORS.lime }}
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
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
            <div className="flex gap-4 mt-4 text-white/90">
              <a href="#" aria-label="Facebook" className="hover:opacity-80 transition"><Facebook size={20} /></a>
              <a href="#" aria-label="Instagram" className="hover:opacity-80 transition"><Instagram size={20} /></a>
              <a href="#" aria-label="LinkedIn" className="hover:opacity-80 transition"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">Layanan</h4>
            <ul className="space-y-2 text-sm/6 text-white/90">
              <li>Pengajuan</li>
              <li>Simulasi</li>
              <li>Cari Rumah</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Hubungi Kami</h4>
            <ul className="text-sm/6 space-y-2 text-white/90">
              <li className="flex items-center gap-2"><Phone size={16} /> 1500046</li>
              <li className="flex items-center gap-2"><Mail size={16} /> kpr@bni.co.id</li>
              <li>🏢 Jl. Jenderal Sudirman Kav. 1<br />Jakarta Pusat 10220</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
