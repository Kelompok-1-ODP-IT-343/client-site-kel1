"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MapPin, Home, Wallet, CreditCard, Clock, Landmark } from "lucide-react";
import Image from "next/image";

const COLORS = { orange: "#FF8500", teal: "#0f766e", gray: "#757575" };

export default function DetailPengajuanPage() {
  // Dummy data untuk chart progress outstanding
  const progressData = [
    { name: "Dibayar", value: 15 },
    { name: "Sisa", value: 165 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-3">
            <Image src="/logo-satuatap.png" alt="logo" width={36} height={36} />
            <span className="font-extrabold text-xl text-[#FF8500]">satuatap</span>
          </div>
          <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
            <a href="/" className="hover:text-[#0f766e]">Beranda</a>
            <a href="/cari-rumah" className="hover:text-[#0f766e]">Cari Rumah</a>
            <a href="/simulasi" className="hover:text-[#0f766e]">Simulasi</a>
          </nav>
          <button className="px-4 py-2 rounded-full text-white text-sm bg-[#0f766e] hover:opacity-90 transition">
            Login
          </button>
        </div>
      </header>

      {/* TITLE */}
      <div className="text-center py-10">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Detail Pengajuan KPR
        </h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
        {/* Informasi Properti */}
        <Card title="Informasi Properti" icon={<Home className="text-[#0f766e]" />}>
          <div className="flex gap-4 items-center">
            <Image
              src="/rumah-1.png"
              alt="Cluster Green Valley"
              width={110}
              height={80}
              className="rounded-xl object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">Cluster Green Valley</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin size={14} /> Serpong, Banten
              </p>
              <p className="mt-1 font-bold text-[#0f766e]">Rp 750.000.000</p>
            </div>
          </div>
        </Card>

        {/* Info Pengajuan */}
        <Card title="Info Pengajuan" icon={<CreditCard className="text-[#0f766e]" />}>
          <ul className="text-sm space-y-2">
            <li><b>Nomor Aplikasi:</b> KPR-2025-009</li>
            <li><b>Tanggal Pengajuan:</b> 12 Oktober 2025</li>
            <li><b>Status Pengajuan:</b> <span className="text-green-700 font-semibold">Disetujui ✅</span></li>
            <li><b>Petugas KPR:</b> Budi Santoso</li>
            <li><b>Cabang:</b> BNI Sudirman</li>
          </ul>
        </Card>

        {/* Detail Pinjaman */}
        <Card title="Detail Pinjaman" icon={<Wallet className="text-[#0f766e]" />}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p><b>Jumlah Pinjaman:</b><br />Rp 525.000.000</p>
            <p><b>Uang Muka:</b><br />Rp 225.000.000</p>
            <p><b>Tenor:</b><br />15 Tahun</p>
            <p><b>Bunga:</b><br />6.25% Fixed 3 Tahun</p>
            <p><b>Tanggal Akad:</b><br />20 Oktober 2025</p>
            <p><b>Angsuran / Bulan:</b><br />Rp 4.850.000</p>
          </div>
        </Card>

        {/* Sisa Outstanding */}
        <Card title="Sisa & Tenor Outstanding" icon={<Clock className="text-[#0f766e]" />}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col text-sm">
              <p><b>Sisa Tenor:</b> 165 Bulan</p>
              <p><b>Total Dibayar:</b> Rp 72.750.000</p>
              <p><b>Sisa Outstanding:</b> Rp 452.250.000</p>
            </div>

            <ResponsiveContainer width={180} height={180}>
              <BarChart data={progressData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" barSize={45} radius={8}>
                  {progressData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? COLORS.teal : COLORS.orange}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Timeline Pengajuan */}
        <div className="md:col-span-2">
          <Card title="Timeline Pengajuan" icon={<Clock className="text-[#0f766e]" />}>
            <div className="space-y-3 text-sm">
              <TimelineItem date="10 Okt 2025" status="✅ Selesai" text="Pengajuan Dikirim" />
              <TimelineItem date="11 Okt 2025" status="✅ Selesai" text="Verifikasi Dokumen" />
              <TimelineItem date="13 Okt 2025" status="⏳ Proses" text="Survey Lapangan" />
              <TimelineItem date="15 Okt 2025" status="❌ Belum" text="Persetujuan Akad" />
            </div>
          </Card>
        </div>

        {/* History Pembayaran */}
        <Card title="History Pembayaran" icon={<Wallet className="text-[#0f766e]" />}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-700">
                <th className="text-left py-1">Bulan</th>
                <th className="text-left">Tanggal Bayar</th>
                <th className="text-left">Jumlah</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Nov 2025</td><td>01-11-2025</td><td>Rp 4.850.000</td><td className="text-green-700">Lunas</td></tr>
              <tr><td>Des 2025</td><td>01-12-2025</td><td>Rp 4.850.000</td><td className="text-green-700">Lunas</td></tr>
              <tr><td>Jan 2026</td><td>-</td><td>Rp 4.850.000</td><td className="text-orange-500">Menunggu</td></tr>
            </tbody>
          </table>
        </Card>

        {/* Info Rekening */}
        <Card title="Info Rekening" icon={<Landmark className="text-[#0f766e]" />}>
          <ul className="text-sm space-y-2">
            <li><b>Nama Pemilik:</b> Acil Bocah Palembang</li>
            <li><b>Nomor Rekening:</b> 0287483879</li>
            <li><b>Bank Tujuan:</b> BNI Sudirman</li>
            <li><b>Virtual Account:</b> 987654321000001</li>
            <li><b>Metode:</b> Autodebet</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* =============== REUSABLE COMPONENTS =============== */
function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function TimelineItem({
  date,
  text,
  status,
}: {
  date: string;
  text: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-2">
      <div>
        <p className="font-semibold text-gray-800">{text}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <span className="text-sm">{status}</span>
    </div>
  );
}
