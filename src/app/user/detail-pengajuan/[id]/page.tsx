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

  // Deteksi tipe file untuk preview gambar pada Dokumen Terlampir
  const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url || "");

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

  // ======== Sinkronisasi dengan langkah di Dashboard Pengajuan ========
  const DASHBOARD_STATUS_ORDER = [
    "Submitted",
    "Property Appraisal",
    "Credit Analysis",
    "Final Approval",
    "Approved",
  ] as const;

  const STAGE_TO_LABEL: Record<string, (typeof DASHBOARD_STATUS_ORDER)[number]> = {
    SUBMITTED: "Submitted",
    PROPERTY_APPRAISAL: "Property Appraisal",
    CREDIT_ANALYSIS: "Credit Analysis",
    FINAL_APPROVAL: "Final Approval",
    APPROVAL: "Final Approval",
    APPROVED: "Approved",
  };

  // Tarik info tanggal/catatan/status dari approvalWorkflows bila tersedia
  const approvalsInfo: Record<string, { date: string; note: string; rawStatus?: string }> =
    Array.isArray(approvals)
      ? approvals.reduce((acc: Record<string, { date: string; note: string; rawStatus?: string }>, a: any) => {
          const lbl = STAGE_TO_LABEL[a.stage];
          if (lbl) {
            acc[lbl] = {
              date: a.dueDate ? new Date(a.dueDate).toLocaleDateString("id-ID") : "-",
              // Catatan hanya dari API; jangan default "Menunggu proses" agar langkah belum mulai benar-benar menampilkan "Belum mulai"
              note: typeof a.approvalNotes === "string" ? a.approvalNotes : "",
              rawStatus: String(a.status || "").toUpperCase(),
            };
          }
          return acc;
        }, {})
      : {};

  // Normalisasi status mentah (untuk referensi tanggal/catatan saja)
  const isPending = (s?: string) => ["PENDING", "IN_PROGRESS", "ONGOING"].includes(String(s).toUpperCase());
  const isCompleted = (s?: string) => ["COMPLETED", "APPROVED", "DONE", "FINISHED"].includes(String(s).toUpperCase());

  // Langkah aktif SELALU mengikuti application.status dari API
  const activeLabel = STAGE_TO_LABEL[application.status] || "Submitted";
  let stepIndex = Math.max(DASHBOARD_STATUS_ORDER.indexOf(activeLabel), 0);

  // Bangun timeline berdasarkan urutan dashboard dan status di approvals
  const timeline: TimelineItem[] = DASHBOARD_STATUS_ORDER.map((label, idx) => {
    const info = approvalsInfo[label];
    // Status tampilan mengikuti urutan index relatif terhadap langkah aktif
    let status: string;
    if (idx < stepIndex) status = "Selesai";
    else if (idx === stepIndex) {
      // Jika status aplikasi sudah final APPROVED/COMPLETED maka tampil Selesai
      const appStatusUpper = String(application.status || "").toUpperCase();
      status = ["APPROVED", "COMPLETED"].includes(appStatusUpper) ? "Selesai" : "Proses";
    } else status = "-";

    // Catatan dan tanggal
    const note = status === "-" ? "Belum mulai" : info?.note || (status === "Selesai" ? "Selesai" : "Menunggu proses");
    let date = status === "-" ? "-" : info?.date || "-";
    // Khusus langkah Submitted, gunakan tanggal pengajuan bila ada
    if (label === "Submitted" && status !== "-" && application.submittedAt) {
      try {
        date = new Date(application.submittedAt).toLocaleDateString("id-ID");
      } catch {}
    }
    return { step: label, date, note, status };
  });

  const progressPercent = Math.round(((Math.max(stepIndex, 0) + 1) / DASHBOARD_STATUS_ORDER.length) * 100);

  // ======== Dummy history pembayaran untuk tampilan ========
  const payments = [
    { month: "Agustus 2025", date: "10-08-2025", amount: 4850000, status: "Lunas" },
    { month: "September 2025", date: "10-09-2025", amount: 4850000, status: "Lunas" },
    { month: "Oktober 2025", date: "10-10-2025", amount: 4850000, status: "Pending" },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12 font-[Inter] bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">Detail Pengajuan KPR</h1>

      {/* ===== INFORMASI PROPERTI ===== */}
      <section className="mt-8 grid md:grid-cols-2 gap-6 bg-white">
        <ColorCard title="Informasi Properti" titleAlign="center">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src={property.mainImage || "/placeholder.png"}
                alt="Properti"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{property.title || "-"}</p>
              <p className="text-gray-500 text-base">{property.city || "-"}</p>
              <p className="text-bni-orange text-2xl font-bold">{f(property.price || 0)}</p>
            </div>
          </div>
        </ColorCard>

        <ColorCard title="Informasi Pengajuan KPR" titleAlign="center">
          {(() => {
            const statusLabel = STAGE_TO_LABEL[application.status] || (application.status ? application.status.replace(/_/g, " ") : "-");
            const DEVELOPER_TYPE_MAP: Record<string, string> = {
              PRIMARY_RESIDENCE: "Developer Pilihan",
            };
            const developerTypeLabel = DEVELOPER_TYPE_MAP[application.purpose] || (application.purpose ? application.purpose.replace(/_/g, " ") : "-");
            return (
              <div className="grid grid-cols-2 gap-y-6 items-center">
                <div className="text-gray-600 text-base">Nomor Aplikasi</div>
                <div className="text-right text-gray-900 font-semibold text-base">{application.applicationNumber}</div>

                <div className="text-gray-600 text-base">Status</div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full bg-bni-orange text-white px-3 py-1 text-sm font-semibold">
                    {statusLabel}
                  </span>
                </div>

                <div className="text-gray-600 text-base">Tipe Developer</div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full border border-blue-500 text-blue-600 px-3 py-1 text-sm font-semibold">
                    {developerTypeLabel}
                  </span>
                </div>

                <div className="text-gray-600 text-base">Nama</div>
                <div className="text-right text-gray-900 font-semibold text-base">{user.fullName}</div>
              </div>
            );
          })()}
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
            const stepName = t.step;
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
          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {documents.map((doc: any) => {
                const key = doc.documentId ?? doc.id ?? doc.filePath;
                const label = doc.documentType || "Dokumen";
                const href = doc.filePath;
                const isImg = isImageUrl(href);
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    className="group block rounded-xl border overflow-hidden bg-gray-50 hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[4/3] bg-white">
                      {isImg ? (
                        <Image src={href} alt={label} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">Lihat Dokumen</div>
                      )}
                    </div>
                    <div className="px-3 py-2 text-sm font-medium text-gray-800 truncate">{label}</div>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Tidak ada dokumen terlampir.</p>
          )}
        </ColorCard>
      </section>

      {/* ===== NOTIFIKASI (DIHILANGKAN SESUAI PERMINTAAN) ===== */}
    </main>
  );
}

/* ==================== SUBCOMPONENTS ==================== */
function ColorCard({ title, children, titleAlign }: { title: string; children: React.ReactNode; titleAlign?: "left" | "center" }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white hover:shadow-lg transition-shadow duration-300">
      <div className={`bg-[#3FD8D5] px-5 py-3 text-white font-semibold text-lg ${titleAlign === "center" ? "text-center" : "text-left"}`}>{title}</div>
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
