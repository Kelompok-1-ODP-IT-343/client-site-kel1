"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  MapPin, Home, Wallet, CreditCard, Clock, Landmark, CheckCircle, Clock3, XCircle, ChevronRight, FileText,
} from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
// import { allHouses } from "@/app/lib/propertyData";
import { motion } from "framer-motion";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
const COLORS = { orange: "#FF8500", teal: "#0f766e", gray: "#a1a1aa", lightTeal: "#a7f3d0" };

// Tipe data untuk status timeline
type TimelineStatus = "done" | "process" | "pending" | "rejected";

export default function DetailPengajuanPage() {
  const applicationData = {
    status: "done", // 'done', 'process', 'rejected'
  };

  const progressData = [
    { name: "Sisa", value: 452250000 },
    { name: "Dibayar", value: 72750000 },
  ];

  // <<< INI PERBAIKANNYA >>>
  const timelineSteps: { title: string; date: string; status: TimelineStatus }[] = [
    { title: "Pengajuan Terkirim", date: "10 Okt 2025", status: "done" },
    { title: "Verifikasi Dokumen", date: "11 Okt 2025", status: "done" },
    { title: "Analisa & Review Kredit", date: "13 Okt 2025", status: "done" },
    { title: "Keputusan Pengajuan", date: "15 Okt 2025", status: "done" },
    { title: "Akad Kredit", date: "20 Okt 2025", status: "process" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>Dashboard</span>
                <ChevronRight size={16} className="mx-1" />
                <span className="font-semibold text-gray-700">Detail Pengajuan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-bni-dark-blue">
                Detail Pengajuan KPR
            </h1>
            <p className="mt-1 text-bni-gray">Nomor Aplikasi: KPR-2025-009</p>
        </div>

        {/* MAIN CONTENT GRID - Responsif */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Kolom Kiri */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Informasi Properti" icon={<Home />}>
                <div className="flex gap-4 items-start">
                  <Image src="/rumah-1.jpg" alt="Cluster Green Valley" width={120} height={120} className="rounded-xl object-cover aspect-square" />
                  <div>
                    <p className="font-semibold text-lg text-gray-900">Cluster Green Valley</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1"><MapPin size={14} /> Serpong, Banten</p>
                    <p className="mt-2 font-bold text-xl text-bni-orange">Rp 750.000.000</p>
                  </div>
                </div>
              </Card>

              <Card title="Informasi Pengajuan" icon={<FileText />}>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <InfoItem label="Status Pengajuan">
                        <StatusBadge status={applicationData.status} />
                    </InfoItem>
                    <InfoItem label="Tanggal Pengajuan" value="12 Oktober 2025" />
                    <InfoItem label="Petugas KPR" value="Budi Santoso" />
                    <InfoItem label="Cabang" value="BNI Sudirman" />
                </div>
              </Card>
            </div>
            
            <Card title="Timeline Pengajuan" icon={<Clock />}>
                <TimelineVertical steps={timelineSteps} />
            </Card>

            <Card title="Riwayat Pembayaran Angsuran" icon={<Wallet />}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-2 font-semibold">Bulan</th>
                      <th className="text-left py-2 px-2 font-semibold">Tanggal Bayar</th>
                      <th className="text-left py-2 px-2 font-semibold">Jumlah</th>
                      <th className="text-left py-2 px-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2.5 px-2">Nov 2025</td>
                      <td className="py-2.5 px-2">01-11-2025</td>
                      <td className="py-2.5 px-2">Rp 4.850.000</td>
                      <td className="py-2.5 px-2"><StatusBadge status="done" text="Lunas" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2.5 px-2">Des 2025</td>
                      <td className="py-2.5 px-2">01-12-2025</td>
                      <td className="py-2.5 px-2">Rp 4.850.000</td>
                      <td className="py-2.5 px-2"><StatusBadge status="done" text="Lunas" /></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2">Jan 2026</td>
                      <td className="py-2.5 px-2">-</td>
                      <td className="py-2.5 px-2">Rp 4.850.000</td>
                      <td className="py-2.5 px-2"><StatusBadge status="process" text="Menunggu" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Kolom Kanan */}
          <div className="flex flex-col gap-6">
            <Card title="Detail Pinjaman" icon={<CreditCard />}>
                <div className="grid grid-cols-2 gap-y-5 text-sm">
                    <InfoItem label="Jumlah Pinjaman" value="Rp 525.000.000" />
                    <InfoItem label="Uang Muka" value="Rp 225.000.000" />
                    <InfoItem label="Tenor" value="15 Tahun" />
                    <InfoItem label="Suku Bunga" value="6.25% Fixed 3 Thn" />
                    <InfoItem label="Angsuran / Bulan" value="Rp 4.850.000" highlight />
                    <InfoItem label="Tanggal Akad" value="20 Oktober 2025" />
                </div>
            </Card>
            
            <Card title="Progress Pinjaman" icon={<Clock3 />}>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full h-48">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={progressData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} cornerRadius={5}>
                        <Cell key="cell-0" fill={COLORS.gray} opacity={0.3} />
                        <Cell key="cell-1" fill={COLORS.orange} />
                      </Pie>
                      <Tooltip formatter={(value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full grid grid-cols-2 gap-4 text-sm text-center">
                    <InfoItem label="Total Dibayar" value="Rp 72.750.000" />
                    <InfoItem label="Sisa Pinjaman" value="Rp 452.250.000" />
                    <InfoItem label="Total Tenor" value="180 Bulan" />
                    <InfoItem label="Sisa Tenor" value="165 Bulan" />
                </div>
              </div>
            </Card>

             <Card title="Informasi Rekening Autodebet" icon={<Landmark />}>
                <div className="space-y-3 text-sm">
                    <InfoItem label="Nama Pemilik Rekening" value="Acil Bocah Palembang" />
                    <InfoItem label="Nomor Rekening BNI" value="0287483879" />
                    <InfoItem label="Virtual Account KPR" value="987654321000001" />
                </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// === KOMPONEN-KOMPONEN REUSABLE ===

const Card = ({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode; }) => (
  <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-center gap-3 mb-5 border-b pb-3">
      <div className="text-bni-orange">{icon}</div>
      <h2 className="text-lg font-bold text-bni-dark-blue">{title}</h2>
    </div>
    {children}
  </motion.div>
);

const InfoItem = ({ label, value, children, highlight = false }: { label: string; value?: string; children?: ReactNode; highlight?: boolean }) => (
    <div>
        <p className="text-xs text-gray-500">{label}</p>
        {value && <p className={`font-semibold ${highlight ? 'text-bni-orange text-lg' : 'text-gray-800'}`}>{value}</p>}
        {children}
    </div>
);

const StatusBadge = ({ status, text }: { status: TimelineStatus | string; text?: string; }) => {
  const styles = {
    done: { bg: 'bg-green-100', text: 'text-green-800', label: 'Disetujui' },
    process: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Dalam Proses' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak' },
    pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Menunggu' },
  };
  const currentStyle = styles[status as keyof typeof styles] || styles.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStyle.bg} ${currentStyle.text}`}>
      {text || currentStyle.label}
    </span>
  );
};

const TimelineVertical = ({ steps }: { steps: { title: string; date: string; status: TimelineStatus }[] }) => {
    const getStatusInfo = (status: TimelineStatus) => {
        switch (status) {
            case "done": return { icon: <CheckCircle className="text-white" size={12} />, color: "bg-green-500" };
            case "process": return { icon: <Clock3 className="text-white" size={12} />, color: "bg-yellow-500 animate-pulse" };
            default: return { icon: <div className="w-2 h-2 bg-gray-300 rounded-full" />, color: "bg-gray-400" };
        }
    };
    return (
        <div className="relative pl-4">
            <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200" style={{ transform: 'translateX(7px)' }}></div>
            <ul className="space-y-8">
                {steps.map((step, index) => {
                    const statusInfo = getStatusInfo(step.status);
                    return (
                        <li key={index} className="relative flex items-start gap-4">
                            <div className={`absolute left-0 top-1 w-4 h-4 rounded-full flex items-center justify-center ${statusInfo.color}`}>
                                {statusInfo.icon}
                            </div>
                            <div className="pl-6">
                                <p className="font-semibold text-gray-800">{step.title}</p>
                                <p className="text-sm text-gray-500">{step.date}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

