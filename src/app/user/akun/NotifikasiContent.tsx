"use client";

import NotificationCard from "./NotifikasiCard";

export default function NotifikasiContent() {
const notifications = [
    {
      title: "Pengajuan KPR Disetujui",
      message: "Pengajuan KPR Anda untuk Cluster Green Valley telah disetujui tahap 1. Silakan lengkapi dokumen berikutnya.",
      time: "2 jam yang lalu",
      type: "approval" as const,
    },
    {
      title: "Pelunasan Pembayaran",
      message: "Pembayaran angsuran bulan Oktober 2025 diterima.",
      time: "10 jam yang lalu",
      type: "payment" as const,
    },
    {
      title: "Pengingat Pembayaran",
      message: "Pembayaran angsuran jatuh tempo dalam 5 hari.",
      time: "23 jam yang lalu",
      type: "reminder" as const,
    },
    {
      title: "Dokumen Terverifikasi",
      message: "Dokumen Anda telah diverifikasi.",
      time: "2 hari yang lalu",
      type: "approval" as const,
    },
  ] as const;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-[#003366] mb-1">Notifikasi</h2>
      <p className="text-sm text-gray-500 mb-6">
        Pantau semua update dan informasi penting terkait pengajuan KPR Anda
      </p>

      <div className="flex flex-col gap-4">
        {notifications.map((item, idx) => (
          <NotificationCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}
