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
  // Keep approvals for verification/app-related successes but exclude plain 'login berhasil'
  if (/disetujui|verifikasi berhasil|berhasil verifikasi|akun.*aktif/.test(t)) return "approval";
  if (/pembayaran|angsuran|pelunasan|diterima|lunas/.test(t)) return "payment";
  // Treat login and other informational messages as reminders
  return "reminder";
}

export default function NotifikasiContent() {
  const [items, setItems] = useState<ApiNotification[] | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 5;

  // Robust parser: treat timestamps without timezone as UTC, then render in client local time
  const parseApiDateToLocal = (input?: string): Date => {
    if (!input) return new Date(NaN);
    const s = String(input).trim();

    // Numeric epoch (seconds or milliseconds)
    if (/^\d+$/.test(s)) {
      const num = Number(s);
      const ms = s.length === 10 ? num * 1000 : num; // 10 digits -> seconds
      return new Date(ms);
    }

    // Already contains timezone info (Z or +HH:MM / -HH:MM)
    if (/[zZ]|[+-]\d{2}:\d{2}$/.test(s)) {
      return new Date(s);
    }

    // Normalize space separator to ISO 'T'
    const normalized = s.replace(" ", "T");
    // Assume backend sends UTC when no timezone provided -> append 'Z'
    return new Date(`${normalized}Z`);
  };

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
        // Convert to local Date first to avoid UTC misinterpretation
        time: formatDistanceToNow(parseApiDateToLocal(n.createdAt), {
          addSuffix: true,
          locale: localeId,
        }),
        type: mapType(n.title, n.notificationType),
      })),
    [items]
  );

  useEffect(() => {
    // Reset ke halaman pertama saat daftar berubah
    setPage(1);
  }, [viewItems.length]);

  const totalPages = Math.max(1, Math.ceil(viewItems.length / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const pageItems = viewItems.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="p-0">
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
        <div>
          <div className="flex flex-col gap-4">
            {pageItems.map((item, idx) => (
              <NotificationCard key={`${page}-${idx}`} {...item} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50"
            >
              Sebelumnya
            </button>

            <span className="text-sm text-gray-500">
              Halaman {page} dari {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
