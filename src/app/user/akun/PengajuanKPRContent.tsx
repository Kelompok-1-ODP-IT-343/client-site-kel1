"use client";

import { useMemo, useState } from "react";
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
import { Application } from "@/app/user/akun/types";
import { cn } from "@/app/lib/util";

const STATUS_ORDER = [
  "Dokumen Terkirim",
  "Peninjauan 1",
  "Peninjauan 2",
  "Peninjauan 3",
] as const;

export default function PengajuanKPRContent() {
  const router = useRouter();
  const [applications] = useState<Application[]>([
    {
      id: 1,
      cluster: "Cluster Green Valley",
      city: "Serpong, Banten",
      status: "Dokumen Terkirim",
      loanAmount: 1_500_000_000,
      date: "15 Juli 2025",
      image: "/rumah-1.jpg",
    },
    {
      id: 2,
      cluster: "Rumah Klasik Menteng",
      city: "Jakarta Pusat",
      status: "Peninjauan 1",
      loanAmount: 25_000_000_000,
      date: "18 Juli 2025",
      image: "/rumah-2.jpg",
    },
  ]);

  const goToDetail = (id: number) =>
    router.push(`/user/detail-pengajuan?loanId=${id}`);

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

  const totalApps = applications.length;
  const totalLoan = useMemo(
    () => applications.reduce((s, a) => s + a.loanAmount, 0),
    [applications]
  );

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
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {totalApps} aplikasi
        </span>
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
          title="Disetujui (Tahap Akhir)"
          value={String(
            applications.filter((a) => a.status === "Peninjauan 3").length
          )}
          accent="#16a34a"
        />
        <SummaryCard
          icon={<RefreshCcw size={24} />}
          title="Total Pinjaman"
          value={formatIDR(totalLoan)}
          accent="#4f46e5"
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
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-200 via-teal-200 to-orange-200 opacity-70" />

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
                          "inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm font-semibold",
                          s.chip
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-2 w-2 rounded-full",
                            s.dot
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
                          className="h-full rounded-full bg-gradient-to-r from-[#3FD8D4] to-[#FF8500] transition-all"
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
                                  ? "border-[#3FD8D4] bg-[#3FD8D4] text-white"
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
