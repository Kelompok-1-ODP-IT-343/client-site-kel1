"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

/* ========= MOCK DATA ========= */
const loanData = [
  {
    id: 1,
    property: {
      name: "Cluster Green Valley",
      city: "Serpong, Banten",
      price: 1500000000,
      image: "/rumah-1.jpg",
    },
    application: {
      number: "KPR-2025-008",
      date: "12 Oktober 2025",
      status: "Peninjauan 2",
      officer: "Budi Santoso",
      branch: "BNI Sudirman",
    },
    loan: {
      principal: 525000000,
      downPayment: 225000000,
      tenorYears: 15,
      interest: "6.25% Fixed 3 Tahun",
      monthlyInstallment: 4850000,
      akadDate: "20 Oktober 2025",
    },
    balance: {
      remainingTenor: 165,
      totalPaid: 72750000,
      outstanding: 452250000,
    },
    timeline: [
      { step: "Dokumen Terkirim", date: "12 Oktober 2025", note: "Pengajuan dikirim oleh nasabah.", status: "Selesai" },
      { step: "Peninjauan 1", date: "13 Oktober 2025", note: "Peninjauan oleh Developer.", status: "Selesai" },
      { step: "Peninjauan 2", date: "15 Oktober 2025", note: "Peninjauan oleh BNI.", status: "Proses" },
      { step: "Peninjauan 3", date: "-", note: "Tahap finalisasi BNI.", status: "-" },
    ],
    payments: [
      { month: "Agustus 2025", date: "10-08-2025", amount: 4850000, status: "Lunas" },
      { month: "September 2025", date: "10-09-2025", amount: 4850000, status: "Lunas" },
      { month: "Oktober 2025", date: "10-10-2025", amount: 4850000, status: "Pending" },
    ],
    account: {
      owner: "Acil Bocah Palembang",
      number: "0287483879",
      bank: "BNI Sudirman",
      va: "9876543210000001",
      method: "Autodebet",
    },
  },
];

export default function DetailPengajuanPage() {
  const params = useSearchParams();
  const loanId = Number(params.get("loanId"));
  const [data, setData] = useState<typeof loanData[0] | null>(null);

  useEffect(() => {
    const selected = loanData.find((d) => d.id === loanId);
    setData(selected || null);
  }, [loanId]);

  if (!data) {
    return <div className="p-8 text-gray-600 text-center">Gagal memuat data atau loan tidak ditemukan.</div>;
  }

  const f = (n: number) =>
    n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

  const currentIndex = data.timeline.findIndex((t) => t.status === "Proses" || t.status === "-");
  const progressPercent = ((currentIndex <= 0 ? 0 : currentIndex - 1) / (data.timeline.length - 1)) * 100;

  /* ===== Hitung progress tenor & outstanding ===== */
  const totalTenor = data.loan.tenorYears * 12;
  const tenorProgress = ((totalTenor - data.balance.remainingTenor) / totalTenor) * 100;
  const totalOutstanding = data.loan.principal;
  const outstandingProgress = ((totalOutstanding - data.balance.outstanding) / totalOutstanding) * 100;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12 font-[Inter] bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Detail Pengajuan KPR
      </h1>

      {/* ===== INFORMASI PROPERTI ===== */}
      <section className="grid md:grid-cols-2 gap-6 bg-white">
        <ColorCard title="Informasi Properti">
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-20 rounded-lg overflow-hidden border">
              <Image src={data.property.image} alt="Properti" fill className="object-cover" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{data.property.name}</p>
              <p className="text-gray-500 text-sm">{data.property.city}</p>
              <p className="text-[#FF8500] font-semibold">{f(data.property.price)}</p>
            </div>
          </div>
        </ColorCard>

        <ColorCard title="Info Pengajuan">
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Nomor Aplikasi: <strong>{data.application.number}</strong></li>
            <li>Tanggal Pengajuan: <strong>{data.application.date}</strong></li>
            <li>Status: <strong>{data.application.status}</strong></li>
            <li>Petugas KPR: <strong>{data.application.officer}</strong></li>
            <li>Cabang: <strong>{data.application.branch}</strong></li>
          </ul>
        </ColorCard>
      </section>

      {/* ===== DETAIL PINJAMAN + CHART ===== */}
      <section className="grid md:grid-cols-2 gap-6 bg-white">
        <ColorCard title="Detail Pinjaman">
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Jumlah Pinjaman: <strong>{f(data.loan.principal)}</strong></li>
            <li>Uang Muka: <strong>{f(data.loan.downPayment)}</strong></li>
            <li>Tenor: <strong>{data.loan.tenorYears} Tahun</strong></li>
            <li>Bunga: <strong>{data.loan.interest}</strong></li>
            <li>Tanggal Akad: <strong>{data.loan.akadDate}</strong></li>
            <li>Angsuran / Bulan: <strong>{f(data.loan.monthlyInstallment)}</strong></li>
          </ul>
        </ColorCard>

        <ColorCard title="Sisa Outstanding & Tenor">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-10 bg-white">
            <RadialChart value={tenorProgress} color="#0066CC" label="Tenor" />
            <RadialChart value={outstandingProgress} color="#FF8500" label="Outstanding" />
          </div>

          <ul className="text-sm text-gray-700 space-y-1 mt-6">
            <li>Sisa Tenor: <strong>{data.balance.remainingTenor} bulan</strong></li>
            <li>Total Dibayar: <strong>{f(data.balance.totalPaid)}</strong></li>
            <li>Sisa Outstanding: <strong>{f(data.balance.outstanding)}</strong></li>
          </ul>
        </ColorCard>
      </section>

      {/* ===== TIMELINE ===== */}
      <ColorCard title="Timeline Pengajuan">
        <div className="relative flex justify-between items-start mt-4">
          <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 rounded-full z-0" />
          <div
            className="absolute top-3 left-0 h-1 bg-[#3FD8D5] rounded-full z-10 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
          {data.timeline.map((t, i) => {
            const active = t.status === "Selesai" || t.status === "Proses";
            return (
              <div key={i} className="relative z-20 flex flex-col items-center w-full text-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    active ? "bg-[#3FD8D5] border-transparent scale-105" : "bg-white border-gray-300"
                  }`}
                >
                  {active && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className={`mt-2 text-sm font-semibold ${active ? "text-[#3FD8D5]" : "text-gray-500"}`}>{t.step}</span>
                <span className="text-xs text-gray-400 mt-1">{t.date}</span>
                <span className="text-xs text-gray-600 italic mt-0.5">{t.note}</span>
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
              {data.payments.map((p, i) => (
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

        <ColorCard title="Info Rekening">
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Nama Pemilik: <strong>{data.account.owner}</strong></li>
            <li>Nomor Rekening: <strong>{data.account.number}</strong></li>
            <li>Bank Tujuan: <strong>{data.account.bank}</strong></li>
            <li>Virtual Account: <strong>{data.account.va}</strong></li>
            <li>Metode: <strong>{data.account.method}</strong></li>
          </ul>
        </ColorCard>
      </section>

      {/* ===== NOTIFIKASI ===== */}
      {data.payments.some((p) => p.status === "Pending") && (
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
      <div className="bg-[#3FD8D5] px-5 py-3 text-white font-semibold text-lg">
        {title}
      </div>
      <div className="bg-white p-6">{children}</div>
    </div>
  );
}

/* Radial Chart — versi putih bersih */
/* Radial Chart */
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

