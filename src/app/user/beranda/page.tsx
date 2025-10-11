"use client";
import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, FileText, Loader2, RefreshCcw, MapPin } from "lucide-react";

export default function DashboardKPR() {
  // Contoh data dummy
  const [applications] = useState([
    {
      id: 1,
      cluster: "Cluster Green Valley",
      city: "Serpong, Banten",
      status: "Disetujui",
      loanAmount: 1500000,
      date: "15 Juli 2025",
      image: "/images/rumah1.jpg",
    },
    {
      id: 2,
      cluster: "Cluster Green Valley",
      city: "Serpong, Banten",
      status: "Disetujui",
      loanAmount: 1500000,
      date: "15 Juli 2025",
      image: "/images/rumah1.jpg",
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <Image src="/logo-satuatap.png" alt="Logo" width={40} height={40} />
            <span className="font-bold text-lg text-orange-500">satuatap</span>
          </div>
          <nav className="flex gap-6 text-gray-700 font-medium">
            <a href="/">Beranda</a>
            <a href="/cari-rumah">Cari Rumah</a>
            <a href="/simulasi">Simulasi</a>
          </nav>
          <button className="px-4 py-2 rounded-full bg-teal-900 text-white text-sm">
            Login
          </button>
        </div>
      </header>

      {/* Hero Dashboard */}
      <section className="bg-teal-100 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Dashboard Tracking KPR
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Kelola aplikasi KPR Anda dengan mudah melalui dashboard ini
          </p>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <FileText className="mx-auto text-teal-700 mb-2" size={32} />
              <h3 className="text-lg font-semibold">Total Aplikasi</h3>
              <p className="text-2xl font-bold text-teal-900">2</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <CheckCircle2 className="mx-auto text-green-600 mb-2" size={32} />
              <h3 className="text-lg font-semibold">Disetujui</h3>
              <p className="text-2xl font-bold text-green-700">2</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <Loader2 className="mx-auto text-yellow-600 mb-2" size={32} />
              <h3 className="text-lg font-semibold">Dalam Review</h3>
              <p className="text-2xl font-bold text-yellow-700">0</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <RefreshCcw className="mx-auto text-indigo-600 mb-2" size={32} />
              <h3 className="text-lg font-semibold">Total Pinjaman</h3>
              <p className="text-2xl font-bold text-indigo-700">Rp 2.5M</p>
            </div>
          </div>
        </div>
      </section>

      {/* List Aplikasi */}
      <section className="max-w-6xl mx-auto w-full px-4 py-10">
        <h2 className="text-xl font-semibold mb-4">Total Aplikasi KPR Saya</h2>
        <div className="flex flex-col gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm border"
            >
              <div className="grid md:grid-cols-3">
                <div className="relative h-48 md:h-full">
                  <Image
                    src={app.image}
                    alt={app.cluster}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-5 flex flex-col justify-between bg-yellow-400/70">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {app.cluster}
                    </h3>
                    <p className="flex items-center text-gray-600 mt-1 text-sm">
                      <MapPin size={16} className="mr-1" /> {app.city}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 mt-4 text-sm text-gray-700">
                    <div>
                      <p className="font-semibold">ID Aplikasi</p>
                      <p>KPR-{app.id.toString().padStart(4, "0")}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Jumlah Pinjaman</p>
                      <p>
                        Rp {app.loanAmount.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Tanggal Pengajuan</p>
                      <p>{app.date}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <span className="flex items-center bg-white text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-700">
                      <CheckCircle2 size={16} className="mr-1" /> {app.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-500 text-white mt-auto py-10">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-sm leading-relaxed">
              PT Bank Negara Indonesia (Persero) Tbk adalah bank BUMN terbesar di Indonesia.
              Kami berkomitmen memberikan layanan KPR terbaik untuk mewujudkan impian rumah Anda.
            </p>
            <div className="flex gap-3 mt-3 text-white/80">
              <i className="ri-facebook-fill"></i>
              <i className="ri-instagram-line"></i>
              <i className="ri-linkedin-box-fill"></i>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-2">Layanan</h4>
            <ul className="space-y-1 text-sm">
              <li>Pengajuan</li>
              <li>Simulasi</li>
              <li>Cari Rumah</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2">Hubungi Kami</h4>
            <ul className="text-sm space-y-1">
              <li>📞 1500046</li>
              <li>📧 kpr@bni.co.id</li>
              <li>🏢 Jl. Jenderal Sudirman Kav. 1<br />Jakarta Pusat 10220</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
