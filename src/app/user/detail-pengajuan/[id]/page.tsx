"use client";

import { JSX, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, AlertCircle, MapPin, ChevronDown, ChevronUp } from "lucide-react";
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
  // Dimensi gambar untuk modal agar mengikuti aspek gambar yang diupload
  const [docDims, setDocDims] = useState<{ w: number; h: number } | null>(null);
  // Modal detail properti
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  // Ekspansi detail per langkah timeline
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [showRateDetails, setShowRateDetails] = useState(false);

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
  // Label tipe developer (Developer Pilihan vs Developer Kerja Sama)
  const partnershipLevelUpper = String((property as any)?.developer?.partnershipLevel || "").toUpperCase();
  const listingTypeUpper = String((property as any)?.listingType || (property as any)?.listing_type || "").toUpperCase();
  const isDevPilihanBase = partnershipLevelUpper === "TOP_SELECTED_DEVELOPER" || (property as any)?.is_developer_pilihan === true || listingTypeUpper === "PRIMARY";
  const purposeUpper = String(application?.purpose || "").toUpperCase();
  const developerTypeLabel = purposeUpper.includes("PRIMARY") ? "Developer Pilihan" : (isDevPilihanBase ? "Developer Pilihan" : "Developer Kerja Sama");

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
    if (isImageUrl(src)) {
      setDocDims(null);
      setDocPreview({ open: true, src, title: title || "Dokumen" });
    }
    else if (typeof window !== "undefined") window.open(src, "_blank");
  };
  const closeDocPreview = () => {
    setDocPreview((p) => ({ ...p, open: false }));
    setDocDims(null);
  };


  const f = (n: number) =>
    n?.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });

  // Title Case helper untuk teks seperti jenis properti (contoh: RUMAH -> Rumah)
  const toTitleCase = (raw?: string | null) => {
    if (!raw) return "-";
    return String(raw)
      .toLowerCase()
      .split(/[ _]+/g)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const parseRateKindYears = (name?: string) => {
    const s = String(name || "");
    const m = s.match(/(fixed|tiered)_(\d+)y/i);
    if (!m) return null;
    return { kind: m[1].toLowerCase(), years: Number(m[2]) };
  };
  const devLabelFromRateName = (rateName?: string) => {
    const s = String(rateName || "");
    const left = s.split(" - ")[0].trim();
    const up = left.toUpperCase();
    if (up.includes("TOP SELECTED")) return "Top Selected Developer";
    return "Developer Kerja Sama";
  };
  const fixedRates: Record<string, Record<number, number>> = {
    "Top Selected Developer": {
      1: 7.75,
      2: 7.75,
      3: 7.75,
      4: 8.0,
      5: 8.0,
      6: 8.0,
      7: 8.0,
      8: 8.0,
      9: 8.25,
      10: 8.25,
      12: 4.75,
      15: 2.75,
      20: 8.5,
      25: 8.75,
      30: 9.0,
    },
    "Developer Kerja Sama": {
      1: 8.0,
      2: 8.0,
      3: 8.0,
      4: 8.25,
      5: 8.25,
      6: 8.25,
      7: 8.25,
      8: 8.25,
      9: 8.75,
      10: 8.75,
      12: 5.25,
      15: 3.25,
      20: 9.25,
      25: 9.75,
      30: 10.25,
    },
  };
  const tieredFirstYear: Record<string, Record<number, number>> = {
    "Top Selected Developer": { 10: 2.75, 15: 2.75, 20: 3.0, 25: 3.25, 30: 3.5 },
    "Developer Kerja Sama": { 10: 3.25, 15: 3.25, 20: 3.5, 25: 3.75, 30: 4.25 },
  };
  const interestPercentFromRateInfo = () => {
    const ri = (data as any)?.kprRateInfo || null;
    const dev = devLabelFromRateName(ri?.rateName);
    const info = parseRateKindYears(ri?.rateName);
    if (!info) return null;
    if (info.kind === "fixed") {
      const v = fixedRates[dev]?.[info.years];
      return typeof v === "number" ? v : null;
    }
    const v = tieredFirstYear[dev]?.[info.years];
    return typeof v === "number" ? v : null;
  };
  const bungaDisplay = (() => {
    const v = interestPercentFromRateInfo();
    if (typeof v === "number") return v;
    const raw = Number(application.interestRate || 0) * 100;
    return Number.isFinite(raw) ? raw : 0;
  })();
  type RateInfo = { rateName?: string };
  type RateBreakdownItem = { year: number; rate: number };
  const tieredSegments: Record<string, Record<number, Array<{ start: number; end: number; rate: number }>>> = {
    "Top Selected Developer": {
      10: [
        { start: 1, end: 1, rate: 2.75 },
        { start: 2, end: 2, rate: 4.75 },
        { start: 3, end: 3, rate: 6.75 },
        { start: 4, end: 4, rate: 8.75 },
        { start: 5, end: 10, rate: 10.75 },
      ],
      15: [
        { start: 1, end: 1, rate: 2.75 },
        { start: 2, end: 3, rate: 4.75 },
        { start: 4, end: 5, rate: 6.75 },
        { start: 6, end: 7, rate: 8.75 },
        { start: 8, end: 10, rate: 10.75 },
      ],
      20: [
        { start: 1, end: 1, rate: 3.0 },
        { start: 2, end: 3, rate: 5.0 },
        { start: 4, end: 5, rate: 7.0 },
        { start: 6, end: 10, rate: 9.0 },
        { start: 11, end: 15, rate: 10.5 },
        { start: 16, end: 20, rate: 11.0 },
      ],
      25: [
        { start: 1, end: 1, rate: 3.25 },
        { start: 2, end: 3, rate: 5.25 },
        { start: 4, end: 5, rate: 7.25 },
        { start: 6, end: 10, rate: 9.25 },
        { start: 11, end: 15, rate: 10.75 },
        { start: 16, end: 20, rate: 11.25 },
        { start: 21, end: 25, rate: 11.75 },
      ],
      30: [
        { start: 1, end: 1, rate: 3.5 },
        { start: 2, end: 3, rate: 5.5 },
        { start: 4, end: 5, rate: 7.5 },
        { start: 6, end: 10, rate: 9.5 },
        { start: 11, end: 15, rate: 11.0 },
        { start: 16, end: 20, rate: 11.5 },
        { start: 21, end: 25, rate: 12.0 },
        { start: 26, end: 30, rate: 12.5 },
      ],
    },
    "Developer Kerja Sama": {
      10: [
        { start: 1, end: 1, rate: 3.25 },
        { start: 2, end: 2, rate: 5.25 },
        { start: 3, end: 3, rate: 7.25 },
        { start: 4, end: 4, rate: 9.25 },
        { start: 5, end: 10, rate: 11.25 },
      ],
      15: [
        { start: 1, end: 1, rate: 3.25 },
        { start: 2, end: 3, rate: 5.25 },
        { start: 4, end: 5, rate: 7.25 },
        { start: 6, end: 7, rate: 9.25 },
        { start: 8, end: 10, rate: 11.25 },
      ],
      20: [
        { start: 1, end: 1, rate: 3.5 },
        { start: 2, end: 3, rate: 5.5 },
        { start: 4, end: 5, rate: 7.5 },
        { start: 6, end: 10, rate: 9.5 },
        { start: 11, end: 15, rate: 11.5 },
        { start: 16, end: 20, rate: 12.0 },
      ],
      25: [
        { start: 1, end: 1, rate: 3.75 },
        { start: 2, end: 3, rate: 5.75 },
        { start: 4, end: 5, rate: 7.75 },
        { start: 6, end: 10, rate: 9.75 },
        { start: 11, end: 15, rate: 11.75 },
        { start: 16, end: 20, rate: 12.25 },
        { start: 21, end: 25, rate: 12.75 },
      ],
      30: [
        { start: 1, end: 1, rate: 4.25 },
        { start: 2, end: 3, rate: 6.25 },
        { start: 4, end: 5, rate: 8.25 },
        { start: 6, end: 10, rate: 10.25 },
        { start: 11, end: 15, rate: 12.25 },
        { start: 16, end: 20, rate: 12.75 },
        { start: 21, end: 25, rate: 13.25 },
        { start: 26, end: 30, rate: 13.75 },
      ],
    },
  };
  const computeTieredBreakdown = (name?: string): { rates: RateBreakdownItem[]; hasFloating: boolean } | null => {
    const info = parseRateKindYears(name);
    if (!info || info.kind !== "tiered") return null;
    const dev = devLabelFromRateName(name);
    const segs = tieredSegments[dev]?.[info.years];
    if (!segs || segs.length === 0) return null;
    const tenor = application.loanTermYears || info.years;
    const maxDefined = Math.max(...segs.map((s) => s.end));
    const ratesByYear: Record<number, number> = {};
    segs.forEach((s) => {
      for (let y = s.start; y <= s.end; y++) ratesByYear[y] = s.rate;
    });
    const listUntil = Math.min(tenor, maxDefined);
    const items: RateBreakdownItem[] = [];
    for (let y = 1; y <= listUntil; y++) {
      const r = ratesByYear[y];
      if (typeof r === "number") items.push({ year: y, rate: r });
    }
    const hasFloating = tenor > maxDefined;
    return { rates: items, hasFloating };
  };
  const rateExplanationView = (): JSX.Element | null => {
    const name = ((data as any)?.kprRateInfo?.rateName as string | undefined) || undefined;
    const info = parseRateKindYears(name);
    if (!info) return null;
    if (info.kind === "fixed") {
      const dev = devLabelFromRateName(name);
      const x = fixedRates[dev]?.[info.years] ?? bungaDisplay;
      const longer = (application.loanTermYears || 0) > info.years;
      const text = longer
        ? `Bunga yang kamu ambil adalah Fixed Rate ${info.years} tahun yaitu bunga akan tetap sama ${x.toFixed(2)}% selama ${info.years} tahun, lalu tahun selanjutnya akan mengikuti bunga floating.`
        : `Bunga yang kamu ambil adalah Fixed Rate ${info.years} tahun yaitu bunga akan tetap sama ${x.toFixed(2)}% selama ${info.years} Tahun.`;
      return (
        <div className="mt-6 rounded-xl border p-4 bg-white">
          <div className="inline-block bg-[#FF8500]/10 text-[#FF8500] font-semibold px-3 py-1 rounded-full text-sm">Fixed Rate</div>
          <p className="mt-3 text-gray-700 text-sm">{text}</p>
        </div>
      );
    }
    const br = computeTieredBreakdown(name);
    if (!br) return null;
    const { rates, hasFloating } = br;
    return (
      <div className="mt-6 space-y-3">
        <div className="inline-block bg-[#3FD8D4]/10 text-[#3FD8D4] font-semibold px-3 py-1 rounded-full text-sm">Bunga Berjenjang</div>
        <p className="text-gray-700 text-sm">Berikut rincian bunga yang berlaku pada pinjaman kamu:</p>
        <div className="space-y-2">
          {rates.map((item) => (
            <div key={item.year} className="flex justify-between items-center bg-gray-50 border rounded-lg px-3 py-2 shadow-sm">
              <span className="text-gray-700 font-medium text-sm">Tahun {item.year}</span>
              <span className="text-gray-900 font-semibold text-sm">{item.rate.toFixed(2)}%</span>
            </div>
          ))}
        </div>
        {hasFloating && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg text-sm text-gray-700">
            Tahun sisanya akan mengikuti bunga <b>floating</b> (mengikuti suku bunga pasar).
          </div>
        )}
      </div>
    );
  };

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
  // Helper untuk label status ringkas dan kelas chip
  const statusLabelAndClass = (i: number): { label: string; cls: string } => {
    if (i === 0) {
      const lbl = timeline[0]?.status || "-";
      if (lbl === "Selesai") return { label: "SELESAI", cls: "bg-green-100 text-green-700 border-green-200" };
      if (lbl === "Proses") return { label: "PROSES", cls: "bg-blue-100 text-blue-700 border-blue-200" };
      return { label: "PENDING", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    }
    if (i >= 1 && i <= 3) {
      const st = upper(workflows[i - 1]?.status);
      if (doneStates.includes(st)) return { label: "SELESAI", cls: "bg-green-100 text-green-700 border-green-200" };
      if (st === "PENDING" || st === "") return { label: "PENDING", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" };
      return { label: "PROSES", cls: "bg-blue-100 text-blue-700 border-blue-200" };
    }
    const lbl = timeline[4]?.status || "-";
    if (lbl === "Selesai") return { label: "SELESAI", cls: "bg-green-100 text-green-700 border-green-200" };
    if (lbl === "Proses") return { label: "PROSES", cls: "bg-blue-100 text-blue-700 border-blue-200" };
    return { label: "PENDING", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" };
  };
  const toggleStep = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

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
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-16">Detail Pengajuan KPR</h1>
      {/* ===== TIMELINE DI PALING ATAS ===== */}
      <ColorCard title="Timeline Pengajuan">
        <div className="relative px-2 py-6">
          <div className="absolute left-8 right-8 top-9 h-[2px] bg-gradient-to-r from-gray-200 via-[#3FD8D4]/40 to-gray-200 rounded-full" />
          <div className="grid grid-cols-4 gap-4 relative">
            {[0,1,2,3].map((i) => {
              const state = nodeState(i);
              const isDone = state === 'done';
              const isActive = state === 'active';
              const dotVisible = state !== 'pending';
              const dotCls = isDone
                ? 'bg-green-500 border-green-500'
                : isActive
                ? 'bg-[#3FD8D4] border-[#3FD8D4]'
                : 'bg-transparent border-transparent';
              const ringCls = isActive ? 'ring-4 ring-[#3FD8D4]/30' : '';
              const title = i === 0 ? 'Submitted' : i === 1 ? 'Property Appraisal' : i === 2 ? 'Credit Analysis' : 'Final Approval';
              const wf = i > 0 ? workflows[i - 1] : undefined;
              const note = wf?.approvalNotes || wf?.rejectionReason || '-';
              const date = i === 0 ? application.submittedAt : (wf?.completedAt || wf?.startedAt || wf?.dueDate || '');
              const { label, cls } = statusLabelAndClass(i);
              const isExpanded = !!expanded[i];
              return (
                <div key={i} className="flex flex-col items-center text-center px-2">
                  {dotVisible ? (
                    <div className={`w-6 h-6 rounded-full border-2 ${dotCls} ${ringCls}`} />
                  ) : (
                    <div className="w-6 h-6" />
                  )}
                  <div className="mt-3 text-sm font-semibold text-gray-900">{title}</div>
                  <div className="mt-2 w-full max-w-[280px] text-xs text-gray-700">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${cls}`}>{label}</span>
                      <span className="text-gray-800">{formatDate(date)}</span>
                      <button
                        type="button"
                        onClick={() => toggleStep(i)}
                        className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                        aria-label="Buka tutup detail"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="mt-2 rounded-xl border p-3 shadow-sm bg-white">
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
          <div className="flex items-start gap-6">
            {property.mainImage ? (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={property.mainImage}
                  alt="Properti"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-lg font-semibold text-gray-800">{property.title || "-"}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-teal-100 text-teal-700 font-medium">
                  {toTitleCase(String(application.propertyType || "-").replace(/_/g, " "))}
                </span>
              </div>
              
              {property.address ? (
                <p className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="truncate">{property.address}</span>
                </p>
              ) : null}
              <p className="text-3xl font-bold text-bni-orange my-3">{f(property.price || 0)}</p>
              <button
                type="button"
                onClick={() => setShowPropertyDetail(true)}
                className="px-4 py-2 bg-[#3FD8D5] text-white rounded-lg shadow-sm hover:bg-[#34c7c3]"
              >
                Detail Properti
              </button>
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
            <div className="text-right text-gray-900 font-semibold text-base">{bungaDisplay.toFixed(2)}%</div>

          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowRateDetails((v) => !v)}
              className="flex items-center gap-2 text-bni-orange font-semibold"
            >
              {showRateDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              {showRateDetails ? "Tutup Rincian Bunga" : "Lihat Rincian Bunga"}
            </button>
            {showRateDetails && rateExplanationView()}
          </div>
        </ColorCard>

        {/* Kanan: Dokumen Terlampir */}
        <ColorCard title="Dokumen Terlampir" titleAlign="center">
          {documents && documents.length > 0 ? (
            (() => {
              const docCount = Array.isArray(documents) ? documents.length : 0;
              const containerClass = docCount <= 2
                ? "flex flex-wrap justify-center gap-6 w-full"
                : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-items-center";
              return (
                <div className={containerClass}>
                  {documents.map((doc: any) => {
                    const key = doc.documentId ?? doc.id ?? doc.filePath;
                    const rawType = String(doc.documentType || doc.type || "").toUpperCase();
                    const href = doc.filePath;
                    const labelMap: Record<string, string> = {
                      KTP: "KTP",
                      SLIP_GAJI: "Slip Gaji",
                      SALARY_SLIP: "Slip Gaji",
                      SP_GAJI: "Slip Gaji",
                    };
                    const displayLabel = labelMap[rawType] || (doc.documentType ? String(doc.documentType).replace(/_/g, " ") : "Dokumen");
                    const gradient = rawType.includes("KTP")
                      ? "from-teal-400 to-emerald-500"
                      : "from-indigo-500 to-blue-500";

                    return (
                      <button
                        key={key}
                        onClick={() => openDocPreview(href, displayLabel)}
                        className="w-40 h-48 rounded-2xl bg-white p-4 shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.03] flex flex-col items-center justify-between"
                      >
                        <div className={`w-28 h-28 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-inner`}>
                          <Image src="/file.svg" alt="dokumen" width={46} height={46} className="opacity-90" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mt-2">{displayLabel}</p>
                      </button>
                    );
                  })}
                </div>
              );
            })()
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
          <div className="max-w-3xl">
            <p className="text-sm text-gray-500">Informasi lengkap properti yang diajukan pengguna</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <InfoRow label="Kode Properti" value={property.propertyCode || "-"} />
              <InfoRow label="Alamat" value={property.address || "-"} />
              <InfoRow label="Kota" value={property.city || "-"} />
              <InfoRow label="Provinsi" value={property.province || "-"} />
              <InfoRow label="Kecamatan" value={property.district || "-"} />
              <InfoRow label="Kelurahan" value={property.village || "-"} />
              <InfoRow label="Kode Pos" value={property.postalCode || "-"} />
              <InfoRow label="Luas Tanah" value={property.landArea != null ? `${property.landArea} m²` : "-"} />
              <InfoRow label="Luas Bangunan" value={property.buildingArea != null ? `${property.buildingArea} m²` : "-"} />
              <InfoRow label="Harga / m²" value={f(property.pricePerSqm)} />
              <InfoRow label="Developer" value={application.developerName || (property as any)?.developer?.companyName || "-"} />
              <InfoRow label="Tipe Developer" value={developerTypeLabel} />
              <InfoRow label="Jenis Properti" value={toTitleCase(String(application.propertyType || "-").replace(/_/g, " "))} />
            </div>
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
                <div className="flex items-center justify-center">
                  <div className="w-[750px] h-[750px] max-w-[86vw] max-h-[64vh]">
                    <Image
                      src={docPreview.src}
                      alt={docPreview.title}
                      fill
                      className="object-contain rounded-lg bg-gray-100"
                      unoptimized
                      onLoad={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        setDocDims({ w: img.naturalWidth, h: img.naturalHeight });
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-700 text-center">
                  Dokumen bukan gambar. Klik ikon tutup lalu buka di tab baru.
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

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900 text-right ml-4">{value ?? "-"}</span>
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
