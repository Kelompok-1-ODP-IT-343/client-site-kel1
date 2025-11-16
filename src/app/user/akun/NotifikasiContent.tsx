"use client";

import { useEffect, useMemo, useState } from "react";
import NotificationCard from "./NotifikasiCard";
import { API_BASE_URL, API_ENDPOINTS } from "@/app/lib/apiConfig";
import { fetchWithAuth } from "@/app/lib/authFetch";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

type ApiNotification = {
  id: number;
  userId: number;
  notificationType: string; // e.g., APPLICATION_UPDATE
  title: string;
  message: string;
  channel: string; // IN_APP, EMAIL, etc.
  status: string; // PENDING, SENT, DELIVERED, READ
  createdAt: string; // ISO
};

function mapType(title: string, notificationType?: string): "approval" | "payment" | "reminder" {
  const t = (title || "").toLowerCase();
  if (/disetujui|verifikasi berhasil|berhasil verifikasi|akun.*aktif|login berhasil/.test(t)) return "approval";
  if (/pembayaran|angsuran|pelunasan|diterima|lunas/.test(t)) return "payment";
  // Default bucket
  return "reminder";
}

export default function NotifikasiContent() {
  const [items, setItems] = useState<ApiNotification[] | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const url = `${API_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS_USER}`;
        const res = await fetchWithAuth(url, { method: "GET" });
        const json = await res.json().catch(() => ({}));
        const list: ApiNotification[] = (json?.data || []) as ApiNotification[];
        if (!mounted) return;
        // Sort newest first
        const sorted = Array.isArray(list)
          ? [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : [];
        setItems(sorted);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Gagal memuat notifikasi.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const viewItems = useMemo(
    () =>
      (items || []).map((n) => ({
        title: n.title,
        message: n.message,
        time: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: localeId }),
        type: mapType(n.title, n.notificationType),
      })),
    [items]
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-[#003366] mb-1">Notifikasi</h2>
      <p className="text-sm text-gray-500 mb-6">
        Pantau semua update dan informasi penting terkait pengajuan KPR Anda
      </p>

      {loading && (
        <div className="space-y-3">
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      )}

      {!loading && error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {!loading && !error && viewItems.length === 0 && (
        <div className="text-sm text-gray-500">Belum ada notifikasi.</div>
      )}

      {!loading && !error && viewItems.length > 0 && (
        <div className="flex flex-col gap-4">
          {viewItems.map((item, idx) => (
            <NotificationCard key={idx} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
