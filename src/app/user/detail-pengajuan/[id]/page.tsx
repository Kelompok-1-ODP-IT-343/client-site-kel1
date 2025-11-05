"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { fetchKprDetail } from "@/app/lib/coreApi";

type TimelineItem = {
  step: string;
  date: string;
  note: string;
  status: string;
};

export default function DetailPengajuanPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadDetail() {
      const res = await fetchKprDetail(Number(id));
      if (res.success) setData(res.data);
      setLoading(false);
    }
    loadDetail();
  }, [id]);

  if (loading) return <div className="p-8 text-gray-600 text-center">Memuat data...</div>;
  if (!data) return <div className="p-8 text-gray-600 text-center">Gagal memuat data atau loan tidak ditemukan.</div>;

  // ======== Data mapping dari API ========
  const property = data.propertyInfo || {};
  const application = data || {};
  const user = data.userInfo || {};
  const documents = data.documents || [];
  const approvals = data.approvalWorkflows || [];

  const f = (n: number) =>
    n?.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });

  // ======== Simulasi Progress Chart ========
  const tenorYears = application.loanTermYears ?? 0;
  const remainingTenor = Math.floor((Math.random() * tenorYears * 12) / 2);
  const tenorProgress = ((tenorYears * 12 - remainingTenor) / (tenorYears * 12)) * 100;
  const outstanding = Math.floor(application.loanAmount * 0.75);
  const outstandingProgress = ((application.loanAmount - outstanding) / application.loanAmount) * 100;

  const stageDisplayNames: Record<string, string> = {
  SUBMITTED: "Pengajuan Dikirim",
  DOCUMENT_VERIFICATION: "Verifikasi Dokumen",
  PROPERTY_APPRAISAL: "Appraisal Properti",
  CREDIT_ANALYSIS: "Analisis Kredit",
  APPROVAL: "Persetujuan",
  OFFER_LETTER: "Surat Penawaran",
  SIGNING: "Penandatanganan Akad",
  DISBURSEMENT: "Pencairan Dana",
  COMPLETED: "Selesai",
  };

// ======== Timeline (PERBAIKAN DITERAPKAN DI SINI) ========
const timeline: TimelineItem[] = approvals.length
  ? approvals.map((a: any) => ({
      step: a.stage,
      date: a.dueDate
        ? new Date(a.dueDate).toLocaleDateString("id-ID")
        : "-",
      note: a.approvalNotes || "Menunggu proses",
      status: a.status === "PENDING" ? "Proses" : "Selesai",
    }))
  : [
      {
        step: "SUBMITTED",
        date: new Date(application.submittedAt).toLocaleDateString("id-ID"),
        note: "Pengajuan dikirim",
        status: "Selesai",
      },
      {
        step: "PROPERTY_APPRAISAL",
        date: "-",
        note: "Menunggu appraisal properti",
        status: "Proses",
      },
    ];

  const currentIndex = timeline.findIndex((t) => t.status === "Proses" || t.status === "-");
  const progressPercent = ((currentIndex <= 0 ? 0 : currentIndex - 1) / (timeline.length - 1)) * 100;

  // ======== Dummy history pembayaran untuk tampilan ========
  const payments = [
    { month: "Agustus 2025", date: "10-08-2025", amount: 4850000, status: "Lunas" },
    { month: "September 2025", date: "10-09-2025", amount: 4850000, status: "Lunas" },
    { month: "Oktober 2025", date: "10-10-2025", amount: 4850000, status: "Pending" },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12 font-[Inter] bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Detail Pengajuan KPR</h1>

      {/* ===== INFORMASI PROPERTI ===== */}
      <section className="grid md:grid-cols-2 gap-6 bg-white">
        <ColorCard title="Informasi Properti">
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-20 rounded-lg overflow-hidden border">
              <Image
                src={property.mainImage || "/placeholder.png"}
                alt="Properti"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{property.title || "-"}</p>
              <p className="text-gray-500 text-sm">{property.city}</p>
              <p className="text-[#FF8500] font-semibold">{f(property.price || 0)}</p>
            </div>
          </div>
        </ColorCard>

        <ColorCard title="Info Pengajuan">
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Nomor Aplikasi: <strong>{application.applicationNumber}</strong></li>
            <li>Status: <strong>{application.status}</strong></li>
            <li>Tujuan: <strong>{application.purpose}</strong></li>
            <li>Nama Nasabah: <strong>{user.fullName}</strong></li>
          </ul>
        </ColorCard>
      </section>

      {/* ===== DETAIL PINJAMAN + CHART ===== */}
      <section className="grid md:grid-cols-2 gap-6 bg-white">
        <ColorCard title="Detail Pinjaman">
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Jumlah Pinjaman: <strong>{f(application.loanAmount)}</strong></li>
            <li>Uang Muka: <strong>{f(application.downPayment)}</strong></li>
            <li>Tenor: <strong>{application.loanTermYears} Tahun</strong></li>
            <li>Bunga: <strong>{(application.interestRate * 100).toFixed(2)}%</strong></li>
            <li>Angsuran / Bulan: <strong>{f(application.monthlyInstallment)}</strong></li>
          </ul>
        </ColorCard>

        <ColorCard title="Sisa Outstanding & Tenor">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-10 bg-white">
            <RadialChart value={tenorProgress} color="#0066CC" label="Tenor" />
            <RadialChart value={outstandingProgress} color="#FF8500" label="Outstanding" />
          </div>

          <ul className="text-sm text-gray-700 space-y-1 mt-6">
            <li>Sisa Tenor: <strong>{remainingTenor} bulan</strong></li>
            <li>Total Dibayar: <strong>{f(application.downPayment || 0)}</strong></li>
            <li>Sisa Outstanding: <strong>{f(outstanding)}</strong></li>
          </ul>
        </ColorCard>
      </section>

      {/* ===== 🔹 NEW: TIMELINE PENGAJUAN  ===== */}
      {/* ===== 🔹 TIMELINE PENGAJUAN ===== */}
      <ColorCard title="Timeline Pengajuan">
        <div className="relative flex justify-between items-start pt-10 px-4">
          {/* Garis abu-abu dasar */}
          <div className="absolute top-12 left-8 right-8 h-1 bg-gray-200 rounded-full z-0" />

          {/* Garis biru progres */}
          <div
            className="absolute top-12 left-8 h-1 bg-[#3FD8D5] rounded-full z-10 transition-all duration-700"
            style={{ width: `${progressPercent || 0}%` }}
          />

          {timeline.map((t: TimelineItem, i: number) => {
            const stepName = stageDisplayNames[t.step] || t.step.replace("_", " ");
            const isSelesai = t.status === "Selesai";
            const isProses = t.status === "Proses";
            const isActive = isSelesai || isProses;

            return (
              <div key={i} className="relative z-20 flex flex-col items-center w-full text-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? "bg-[#3FD8D5] border-transparent scale-105"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {isSelesai && <CheckCircle2 size={14} className="text-white" />}
                  {isProses && <div className="w-3 h-3 bg-white rounded-full animate-pulse" />}
                </div>

                <span
                  className={`mt-2 text-sm font-semibold ${
                    isActive ? "text-[#3FD8D5]" : "text-gray-500"
                  }`}
                >
                  {stepName}
                </span>
                <span className="text-xs text-gray-400 mt-1">{t.date}</span>
                <span className="text-xs text-gray-600 italic mt-0.5 whitespace-nowrap">
                  {t.note}
                </span>
              </div>
            );
          })}
        </div>
      </ColorCard>


      {/* ===== HISTORY PEMBAYARAN + REKENING ===== */}
      <section className="grid md:grid-cols-2 gap-6 bg-white">
        <ColorCard title="History Pembayaran">
          <table className="w-full text-sm border-t">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2">Bulan</th>
                <th>Tanggal Bayar</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i} className="border-b text-gray-700">
                  <td className="py-2">{p.month}</td>
                  <td>{p.date}</td>
                  <td>{f(p.amount)}</td>
                  <td className={`${p.status === "Lunas" ? "text-green-600" : "text-orange-500"}`}>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ColorCard>

        <ColorCard title="Dokumen Terlampir">
          <ul className="text-sm text-gray-700 space-y-2">
            {documents.map((doc: any) => (
              <li key={doc.documentId}>
                <a href={doc.filePath} target="_blank" className="text-blue-600 hover:underline">
                  {doc.documentType}
                </a>
              </li>
            ))}
          </ul>
        </ColorCard>
      </section>

      {/* ===== NOTIFIKASI ===== */}
      {payments.some((p) => p.status === "Pending") && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm">
          <AlertCircle className="w-5 h-5" />
          <p>
            Tagihan bulan ini belum dibayar.{" "}
            <a href="#" className="underline font-medium text-red-700 hover:text-red-900">
              Bayar Sekarang
            </a>
          </p>
        </div>
      )}
    </main>
  );
}

/* ==================== SUBCOMPONENTS ==================== */
function ColorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="bg-[#3FD8D5] px-5 py-3 text-white font-semibold text-lg">{title}</div>
      <div className="bg-white p-6">{children}</div>
    </div>
  );
}

function RadialChart({ value, color, label }: { value: number; color: string; label: string }) {
  const chart = [{ value, fill: color }];

  return (
    <div className="flex flex-col items-center bg-gray-50 rounded-xl p-4 shadow-inner">
      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            barSize={18}
            data={chart}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={30}
              background={{ fill: "#E5E7EB" }}
              isAnimationActive={true}
              animationDuration={1200}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold" style={{ color }}>{value.toFixed(1)}%</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
