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
import {
  MapPin,
  Home,
  Wallet,
  CreditCard,
  Clock,
  Landmark,
  CheckCircle,
  Clock3,
  XCircle,
} from "lucide-react";
import Image from "next/image";

const COLORS = { orange: "#FF8500", teal: "#0f766e", gray: "#757575" };

export default function DetailPengajuanPage() {
  // Dummy data untuk chart progress outstanding
  const progressData = [
    { name: "Dibayar", value: 15 },
    { name: "Sisa", value: 165 },
  ];

  // Data untuk timeline pengajuan
  const timelineSteps = [
    { title: "Pengajuan Terkirim", date: "10 Okt 2025", status: "done" },
    { title: "Verifikasi Dokumen", date: "11 Okt 2025", status: "done" },
    { title: "Review", date: "13 Okt 2025", status: "process" },
    { title: "Diterima / Ditolak", date: "15 Okt 2025", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-3">
            <Image src="/logo-satuatap.png" alt="logo" width={36} height={36} />
            <span className="font-extrabold text-xl text-[#FF8500]">
              satuatap
            </span>
          </div>
          <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
            <a href="/" className="hover:text-[#0f766e]">
              Beranda
            </a>
            <a href="/cari-rumah" className="hover:text-[#0f766e]">
              Cari Rumah
            </a>
            <a href="/simulasi" className="hover:text-[#0f766e]">
              Simulasi
            </a>
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
            <li>
              <b>Nomor Aplikasi:</b> KPR-2025-009
            </li>
            <li>
              <b>Tanggal Pengajuan:</b> 12 Oktober 2025
            </li>
            <li>
              <b>Status Pengajuan:</b>{" "}
              <span className="text-green-700 font-semibold">Disetujui ✅</span>
            </li>
            <li>
              <b>Petugas KPR:</b> Budi Santoso
            </li>
            <li>
              <b>Cabang:</b> BNI Sudirman
            </li>
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
            <TimelineVertical steps={timelineSteps} />
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

/* ================= Timeline Vertical ================= */
function TimelineVertical({ steps }: { steps: any[] }) {
  const getStatus = (status: string) => {
    switch (status) {
      case "done":
        return {
          color: "text-green-600",
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          label: "Selesai",
        };
      case "process":
        return {
          color: "text-yellow-600",
          icon: <Clock3 className="w-4 h-4 text-yellow-600" />,
          label: "Proses",
        };
      case "pending":
        return {
          color: "text-gray-400",
          icon: <XCircle className="w-4 h-4 text-gray-400" />,
          label: "Belum",
        };
      default:
        return {
          color: "text-gray-400",
          icon: <XCircle className="w-4 h-4 text-gray-400" />,
          label: "Belum",
        };
    }
  };

  return (
    <div className="relative pl-6">
      {/* Garis utama */}
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <ul className="space-y-8">
        {steps.map((step, index) => {
          const status = getStatus(step.status);
          return (
            <li key={index} className="relative flex justify-between items-start">
              {/* Bullet */}
              <div className="absolute -left-[9px] mt-1">
                <span
                  className={`block w-3.5 h-3.5 rounded-full border-2 ${
                    step.status === "done"
                      ? "bg-green-500 border-green-600"
                      : step.status === "process"
                      ? "bg-yellow-400 border-yellow-500"
                      : "bg-gray-300 border-gray-400"
                  }`}
                ></span>
              </div>

              {/* Konten kiri */}
              <div className="pl-3">
                <h3 className="text-base font-semibold text-gray-900 leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{step.date}</p>
              </div>

              {/* Status kanan */}
              <div className="flex items-center gap-1 text-sm">
                {status.icon}
                <span className={`${status.color} font-medium`}>
                  {status.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
