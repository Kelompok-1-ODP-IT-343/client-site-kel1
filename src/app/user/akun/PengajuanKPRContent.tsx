"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  FileText,
  CheckCircle2,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import InfoItem from "@/app/user/akun/InfoItem";
import SummaryCard from "@/app/user/akun/SummaryCard";
import { formatIDR } from "@/app/user/akun/formatIDR";
import { STATUS_STYLES } from "@/app/user/akun/constants";
import { Application, KprHistoryItem } from "@/app/user/akun/types";
import { cn } from "@/app/lib/util";
import { fetchKprHistory } from "@/app/lib/coreApi";

const STATUS_ORDER = [
  "Submitted",
  "Property Appraisal",
  "Credit Analysis",
  "Final Approval",
] as const;

// Function to map API status to display status
const STATUS_MAP: Record<string, string> = {
  SUBMITTED: "Submitted",
  PROPERTY_APPRAISAL: "Property Appraisal",
  CREDIT_ANALYSIS: "Credit Analysis",
  FINAL_APPROVAL: "Final Approval",
  // Map APPROVED to the last visible step so timeline remains 4 steps
  APPROVED: "Final Approval",
};

const mapApiStatusToDisplayStatus = (apiStatus: string) =>
  STATUS_MAP[apiStatus] || apiStatus;

// Function to convert API response to Application format
const convertKprHistoryToApplication = (item: KprHistoryItem): Application => {
  const date = new Date(item.tanggalPengajuan);
  const formattedDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return {
    id: item.id,
    cluster: item.namaRumah,
    city: item.lokasiRumah,
    status: mapApiStatusToDisplayStatus(item.statusPengajuan) as any,
    loanAmount: item.jumlahPinjaman,
    date: formattedDate,
    image: item.fotoProperti || "/rumah-1.jpg", // fallback image
  };
};

export default function PengajuanKPRContent() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Move useMemo before any conditional returns
  const totalApps = applications.length;
  const totalLoan = useMemo(
    () => applications.reduce((s, a) => s + a.loanAmount, 0),
    [applications]
  );

  useEffect(() => {
    const loadKprHistory = async () => {
      try {
        setLoading(true);
        const result = await fetchKprHistory();

        if (result.success) {
          const convertedApplications = result.data.map(convertKprHistoryToApplication);
          setApplications(convertedApplications);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    loadKprHistory();
  }, []);

  const goToDetail = (id: number) =>
    router.push(`/user/detail-pengajuan/${id}`);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-teal-100">
          <RefreshCcw className="h-8 w-8 text-bni-orange animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Memuat data pengajuan...
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Mohon tunggu sebentar.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-red-100">
          <FileText className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-800">
          Gagal memuat data
        </h3>
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-orange-100 to-teal-100">
          <FileText className="h-8 w-8 text-bni-orange" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Belum ada pengajuan aktif
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Mulai ajukan KPR untuk memantau progres di sini.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Monitoring Progress KPR
          </h2>
          <p className="text-sm text-gray-500">
            Pantau status pengajuan dan detailnya secara real-time.
          </p>
        </div>
        {/* Label jumlah aplikasi dihilangkan karena sudah ditampilkan pada kartu ringkasan "Total Aplikasi" */}
      </div>

      {/* Ringkasan */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          icon={<FileText size={24} />}
          title="Total Aplikasi"
          value={String(totalApps)}
          accent="#3FD8D4"
        />
        <SummaryCard
          icon={<CheckCircle2 size={24} />}
          title="Persetujuan Tahap Akhir"
          value={String(
            applications.filter((a) => a.status === "Final Approval").length
          )}
          accent="#3FD8D4"
        />
        <SummaryCard
          icon={<RefreshCcw size={24} />}
          title="Total Pinjaman"
          value={formatIDR(totalLoan)}
          accent="#3FD8D4"
          isMoney
        />
      </div>

      <div className="flex flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {applications.map((app) => {
            const s = STATUS_STYLES[app.status];
            const stepIndex = Math.max(
              STATUS_ORDER.indexOf(app.status as (typeof STATUS_ORDER)[number]),
              0
            );
            const totalSteps = STATUS_ORDER.length;
            const progressPct = Math.round(
              ((stepIndex + 1) / totalSteps) * 100
            );
            // const progressPct =
            //   app.status === "Completed"
            //     ? 100
            //     : Math.round(((stepIndex + 1) / totalSteps) * 100);

            return (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-transparent transition-all hover:shadow-lg hover:ring-gray-200"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FFE8D2] via-[#FFC58A] to-[#FF8D28] opacity-70" />

                <div className="grid md:grid-cols-[300px_1fr]">
                  <div className="relative h-48 w-full md:h-full">
                    <Image
                      src={app.image}
                      alt={app.cluster}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-gray-900 shadow backdrop-blur-sm">
                      Pinjaman: {formatIDR(app.loanAmount)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {app.cluster}
                        </h3>
                        <p className="mt-1 flex items-center text-sm text-gray-600">
                          <MapPin size={14} className="mr-1" /> {app.city}
                        </p>
                      </div>

                      <span
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm font-semibold", "text-gray-500 border-gray-300"
                          // s.chip || "text-gray-500 border-gray-300"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-2 w-2 rounded-full",
                            "bg-gray-300"
                            // s.dot || "bg-gray-300"
                          )}
                        />
                        {app.status}
                      </span>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                        <span>Progres</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#00B894] via-[#00D1A0] to-[#2ECC71] transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div className="mt-3 grid grid-cols-4 gap-2 text-[11px] font-medium text-gray-500">
                        {STATUS_ORDER.map((label, idx) => (
                          <div key={label} className="flex items-center gap-1">
                            <div
                              className={cn(
                                "grid h-4 w-4 place-items-center rounded-full border",
                                idx <= stepIndex
                                  ? "border-[#00B894] bg-[#00B894] text-white"
                                  : "border-gray-300 bg-white text-gray-400"
                              )}
                            >
                              {idx < stepIndex
                                ? "✓"
                                : idx === stepIndex
                                ? "•"
                                : ""}
                            </div>
                            <span
                              className={cn(
                                "truncate",
                                idx <= stepIndex
                                  ? "text-gray-700"
                                  : "text-gray-400"
                              )}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                      <InfoItem
                        label="Nomor Aplikasi"
                        value={`KPR-${app.id.toString().padStart(4, "0")}`}
                      />
                      <InfoItem
                        label="Jumlah Pinjaman"
                        value={formatIDR(app.loanAmount)}
                      />
                      <InfoItem label="Tanggal Update" value={app.date} />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => goToDetail(app.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-bni-orange px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg hover:brightness-95"
                      >
                        Lihat Detail
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
