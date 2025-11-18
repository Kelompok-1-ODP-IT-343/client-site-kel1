"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, AlertCircle, MapPin } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { fetchKprDetail } from "@/app/lib/coreApi";
import Dialog from "@/components/ui/Dialog";

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
  // State untuk modal pratinjau dokumen ditempatkan sebelum return kondisional
  const [docPreview, setDocPreview] = useState<{ open: boolean; src: string; title: string }>({ open: false, src: "", title: "" });
  // Modal detail properti
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);

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
  
  // Helper formatters (ikuti style util sederhana yang sudah ada)
  const formatDate = (s?: string) => {
    if (!s) return "-";
    try {
      const d = new Date(s);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return "-";
    }
  };

  // Deteksi tipe file untuk preview gambar pada Dokumen Terlampir
  const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url || "");

  // Handler modal pratinjau dokumen (diletakkan setelah helper, bukan setelah return kondisional)
  const openDocPreview = (src?: string, title?: string) => {
    if (!src) return;
    if (isImageUrl(src)) setDocPreview({ open: true, src, title: title || "Dokumen" });
    else if (typeof window !== "undefined") window.open(src, "_blank");
  };
  const closeDocPreview = () => setDocPreview((p) => ({ ...p, open: false }));


  const f = (n: number) =>
    n?.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });

  // ======== Progress Tenor & Outstanding ========
  const tenorYears = application.loanTermYears ?? 0;
  const totalMonths = (tenorYears || 0) * 12;
  const appStatusUpper = String(application.status || "").toUpperCase();
  const INITIAL_STATUSES = [
    "SUBMITTED",
    "PROPERTY_APPRAISAL",
    "CREDIT_ANALYSIS",
    "FINAL_APPROVAL",
    "APPROVED",
  ];
  // Jika status masih tahap awal (belum ada pembayaran), sisa tenor = default sesuai tenor
  const remainingTenor = INITIAL_STATUSES.includes(appStatusUpper)
    ? totalMonths
    : Math.max(totalMonths - Math.floor(totalMonths * 0.25), 0);
  const tenorProgress = totalMonths > 0 ? (((totalMonths - remainingTenor) / totalMonths) * 100) : 0;
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

  // ======== Data & helper khusus Stepper (mengikuti contoh) ========
  const WORKFLOW_ORDER = ["PROPERTY_APPRAISAL", "CREDIT_ANALYSIS", "FINAL_APPROVAL"] as const;
  const workflows = Array.isArray(approvals)
    ? [...approvals].sort((a: any, b: any) => {
        const ia = WORKFLOW_ORDER.indexOf((a?.stage || "").toUpperCase() as any);
        const ib = WORKFLOW_ORDER.indexOf((b?.stage || "").toUpperCase() as any);
        if (ia !== ib) return ia - ib;
        return (a?.workflowId ?? 0) - (b?.workflowId ?? 0);
      })
    : [];

  const upper = (s?: string) => String(s || "").toUpperCase();
  const doneStates = ["APPROVED", "COMPLETED", "DONE", "FINISHED"];
  const nameOrEmail = (wf?: any) => (wf?.assignedToName?.trim?.() ? wf.assignedToName : (wf?.assignedToEmail || "-"));
  const statusBadge = (status?: string) => {
    const s = upper(status);
    if (doneStates.includes(s)) return "bg-green-100 text-green-700 border-green-200";
    if (s === "REJECTED") return "bg-red-100 text-red-700 border-red-200";
    if (s === "IN_PROGRESS") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200"; // PENDING/other
  };
  type NodeState = "done" | "active" | "pending";
  const nodeState = (index: number): NodeState => {
    // index 0 = Assignment (sebelum workflow 1)
    if (index === 0) return workflows.length > 0 ? "done" : "active";
    const wf = workflows[index - 1];
    const st = upper(wf?.status);
    if (doneStates.includes(st)) return "done";
    const prevDone = index === 1 ? true : doneStates.includes(upper(workflows[index - 2]?.status));
    if (prevDone && (st === "PENDING" || st === "IN_PROGRESS" || st === "")) return "active";
    return "pending";
  };

  // ======== Dummy history pembayaran untuk tampilan ========
  const payments = [
    { month: "Agustus 2025", date: "10-08-2025", amount: 4850000, status: "Lunas" },
    { month: "September 2025", date: "10-09-2025", amount: 4850000, status: "Lunas" },
    { month: "Oktober 2025", date: "10-10-2025", amount: 4850000, status: "Pending" },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12 font-[Inter] bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">Detail Pengajuan KPR</h1>
      {/* ===== TIMELINE DI PALING ATAS ===== */}
      <ColorCard title="Timeline Pengajuan">
        <div className="relative px-2 py-6">
          <div className="absolute left-8 right-8 top-10 h-1 bg-gradient-to-r from-gray-200 via-[#3FD8D4]/40 to-gray-200 rounded-full" />
          <div className="grid grid-cols-4 gap-4 relative">
            {[0,1,2,3].map((i) => {
              const state = nodeState(i);
              const isDone = state === 'done';
              const isActive = state === 'active';
              const dotCls = isDone ? 'bg-green-500 border-green-500' : isActive ? 'bg-[#3FD8D4] border-[#3FD8D4]' : 'bg-gray-200 border-gray-300';
              const ringCls = isActive ? 'ring-4 ring-[#3FD8D4]/30' : '';
              const title = i === 0 ? 'Submitted' : i === 1 ? 'Property Appraisal' : i === 2 ? 'Credit Analysis' : 'Final Approval';
              const wf = i > 0 ? workflows[i - 1] : undefined;
              const note = wf?.approvalNotes || wf?.rejectionReason || '-';
              const date = i === 0 ? application.submittedAt : (wf?.completedAt || wf?.startedAt || wf?.dueDate || '');
              return (
                <div key={i} className="flex flex-col items-center text-center px-2">
                  <div className={`w-6 h-6 rounded-full border ${dotCls} ${ringCls}`} />
                  <div className="mt-3 text-sm font-semibold text-gray-900">{title}</div>
                  <div className="mt-2 w-full max-w-[280px] rounded-xl border p-3 shadow-sm bg-white text-xs text-gray-700">
                    {i === 0 ? (
                      <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-gray-500">Pemohon</span><span className="font-medium truncate max-w-[60%] text-right">{user.fullName || application.applicantName || '-'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Tanggal</span><span className="font-medium">{formatDate(date)}</span></div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-gray-500">PIC</span><span className="font-medium truncate max-w-[60%] text-right">{nameOrEmail(wf)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium truncate max-w-[60%] text-right">{wf?.assignedToEmail || '-'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Status</span>
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${statusBadge(wf?.status)}`}>{wf?.status ?? 'PENDING'}</span>
                        </div>
                        <div className="flex justify-between"><span className="text-gray-500">Tanggal</span><span className="font-medium">{formatDate(date)}</span></div>
                        <div className="text-left"><span className="text-gray-500">Note: </span><span className="font-medium">{note}</span></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ColorCard>

      {/* ===== INFORMASI PENGAJUAN (kiri) & PROPERTI (kanan) ===== */}
      <section className="mt-8 grid md:grid-cols-2 gap-6 bg-white">
        {/* Kiri: Ringkasan Aplikasi */}
        <ColorCard title="Informasi Pengajuan KPR" titleAlign="center">
          <div className="grid grid-cols-2 gap-y-6 items-center">
            <div className="text-gray-600 text-base">Nomor Aplikasi</div>
            <div className="text-right text-gray-900 font-semibold text-base">{application.applicationNumber || "-"}</div>

            <div className="text-gray-600 text-base">Status</div>
            <div className="text-right text-gray-900 font-semibold text-base">{application.status || "-"}</div>

            <div className="text-gray-600 text-base">Nama</div>
            <div className="text-right text-gray-900 font-semibold text-base">{user.fullName}</div>

            <div className="text-gray-600 text-base">Tanggal Pengajuan</div>
            <div className="text-right text-gray-900 font-semibold text-base">{formatDate(application.submittedAt)}</div>

            <div className="text-gray-600 text-base">Jenis Sertifikat</div>
            <div className="text-right text-gray-900 font-semibold text-base">{application.propertyCertificateType || "-"}</div>

            <div className="text-gray-600 text-base">Catatan</div>
            <div className="text-right text-gray-900 font-semibold text-base">{application.notes || "-"}</div>
          </div>
        </ColorCard>

        {/* Kanan: Ringkasan Properti + tombol modal */}
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
              <span className="inline-flex items-center rounded-full border border-blue-500 text-blue-600 px-3 py-1 text-sm font-semibold">Developer Pilihan</span>
              <p className="mt-2 text-xl font-semibold text-gray-900">{property.title || "-"}</p>
              <p className="mt-1 text-gray-500 text-base inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{property.city || "-"}</span>
              </p>
              <p className="text-bni-orange text-2xl font-bold">{f(property.price || 0)}</p>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowPropertyDetail(true)}
                  className="inline-flex items-center rounded-lg bg-[#3FD8D5] hover:bg-[#34c7c3] text-white px-4 py-2 text-sm font-semibold shadow"
                >
                  Detail Properti
                </button>
                {application?.purpose && (
                  <span className="ml-3 inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-semibold border border-gray-200">
                    {(String(application.purpose)).replace(/_/g, " ")}
                  </span>
                )}
              </div>
              <div className="mt-3 text-sm text-gray-700">
                <span className="text-gray-600">Jenis Properti:</span>{" "}
                <span className="font-semibold">{application.propertyType || "-"}</span>
              </div>
            </div>
          </div>
        </ColorCard>
      </section>

      {/* ===== BARIS KETIGA: Detail Pinjaman KPR (kiri) & Dokumen Terlampir (kanan) ===== */}
      <section className="grid md:grid-cols-2 gap-6 bg-white">
        {/* Kiri: Detail Pinjaman KPR */}
        <ColorCard title="Detail Pinjaman KPR" titleAlign="center">
          <div className="grid grid-cols-2 gap-y-6 items-center">
            <div className="text-gray-600 text-base">Jumlah Pinjaman</div>
            <div className="text-right text-gray-900 font-semibold text-base">{f(application.loanAmount)}</div>

            <div className="text-gray-600 text-base">Uang Muka</div>
            <div className="text-right text-gray-900 font-semibold text-base">{f(application.downPayment)}</div>

            <div className="text-gray-600 text-base">Tenor</div>
            <div className="text-right text-gray-900 font-semibold text-base">{application.loanTermYears} Tahun</div>

            <div className="text-gray-600 text-base">Bunga</div>
            <div className="text-right text-gray-900 font-semibold text-base">{(application.interestRate * 100).toFixed(2)}%</div>

            <div className="text-gray-600 text-base">Angsuran / Bulan</div>
            <div className="text-right text-gray-900 font-semibold text-base">{f(application.monthlyInstallment)}</div>

            <div className="text-gray-600 text-base">Rasio LTV</div>
            <div className="text-right text-gray-900 font-semibold text-base">{application.ltvRatio != null ? `${application.ltvRatio}%` : "-"}</div>
          </div>
        </ColorCard>

        {/* Kanan: Dokumen Terlampir */}
        <ColorCard title="Dokumen Terlampir" titleAlign="center">
          {documents && documents.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {documents.map((doc: any) => {
                const key = doc.documentId ?? doc.id ?? doc.filePath;
                const rawType = String(doc.documentType || doc.type || "").toUpperCase();
                const href = doc.filePath;
                const labelMap: Record<string, string> = {
                  KTP: "KTP",
                  SLIP_GAJI: "SP GAJI",
                  SALARY_SLIP: "SP GAJI",
                  SP_GAJI: "SP GAJI",
                };
                const displayLabel = labelMap[rawType] || (doc.documentType ? String(doc.documentType).replace(/_/g, " ") : "Dokumen");
                const gradient = rawType.includes("KTP")
                  ? "from-emerald-400 to-teal-500"
                  : rawType.includes("GAJI") || rawType.includes("SLIP")
                  ? "from-blue-500 to-indigo-500"
                  : "from-gray-300 to-gray-400";

                return (
                  <div key={key} className="rounded-2xl bg-gray-50 p-6 flex flex-col items-center justify-center text-center shadow-sm">
                    <button
                      type="button"
                      onClick={() => openDocPreview(href, displayLabel)}
                      className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow hover:shadow-md transition-transform hover:scale-105`}
                      aria-label={`Lihat ${displayLabel}`}
                    >
                      <Image src="/file.svg" alt="Ikon Dokumen" width={44} height={44} />
                    </button>
                    <div className="mt-4 text-center text-sm font-semibold text-gray-900">{displayLabel}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">Tidak ada dokumen terlampir.</p>
          )}
        </ColorCard>
      </section>

      {/* Modal Detail Properti */}
      <Dialog
        open={showPropertyDetail}
        onClose={() => setShowPropertyDetail(false)}
        title="Detail Properti"
        description={property ? (
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-gray-600">Kode Properti</div>
            <div className="text-right text-gray-900 font-semibold">{property.propertyCode || "-"}</div>

            <div className="text-gray-600">Alamat</div>
            <div className="text-right text-gray-900 font-semibold">{property.address || "-"}</div>

            <div className="text-gray-600">Provinsi</div>
            <div className="text-right text-gray-900 font-semibold">{property.province || "-"}</div>

            <div className="text-gray-600">Kecamatan</div>
            <div className="text-right text-gray-900 font-semibold">{property.district || "-"}</div>

            <div className="text-gray-600">Kelurahan</div>
            <div className="text-right text-gray-900 font-semibold">{property.village || "-"}</div>

            <div className="text-gray-600">Kode Pos</div>
            <div className="text-right text-gray-900 font-semibold">{property.postalCode || "-"}</div>

            <div className="text-gray-600">Luas Tanah</div>
            <div className="text-right text-gray-900 font-semibold">{property.landArea != null ? `${property.landArea} m²` : "-"}</div>

            <div className="text-gray-600">Luas Bangunan</div>
            <div className="text-right text-gray-900 font-semibold">{property.buildingArea != null ? `${property.buildingArea} m²` : "-"}</div>

            <div className="text-gray-600">Harga/m²</div>
            <div className="text-right text-gray-900 font-semibold">{f(property.pricePerSqm)}</div>

            <div className="text-gray-600">Developer</div>
            <div className="text-right text-gray-900 font-semibold">{application.developerName || (property as any)?.developer?.companyName || "-"}</div>

            <div className="text-gray-600">Jenis Properti</div>
            <div className="text-right text-gray-900 font-semibold">{application.propertyType || "-"}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-700">Informasi properti tidak tersedia.</div>
        )}
      />

      {/* Modal Pratinjau Dokumen */}
      <Dialog
        open={docPreview.open}
        title={docPreview.title}
        onClose={closeDocPreview}
        description={
          docPreview.src && isImageUrl(docPreview.src) ? (
            <div className="relative w-[86vw] max-w-3xl h-[70vh]">
              <Image src={docPreview.src} alt={docPreview.title} fill className="object-contain rounded-lg bg-gray-100" />
            </div>
          ) : (
            <div className="text-sm text-gray-700">
              Dokumen bukan gambar. Klik tombol Tutup lalu buka di tab baru.
            </div>
          )
        }
      />

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
    <div className="flex flex-col items-center bg-white rounded-xl p-4">
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
        <p
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold"
          style={{ color }}
        >
          {value.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
