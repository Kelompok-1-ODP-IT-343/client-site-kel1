"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BarChart2, CheckCircle2, AlertCircle } from "lucide-react";

/* ========= MOCK DATA (bisa ganti ke API backend) ========= */
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
      status: "Disetujui",
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
      { step: "Pengajuan Terkirim", status: "Selesai" },
      { step: "Verifikasi Dokumen", status: "Selesai" },
      { step: "Review", status: "Proses" },
      { step: "Diterima / Ditolak", status: "-" },
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
  {
    id: 2,
    property: {
      name: "Rumah Klasik Menteng",
      city: "Jakarta Pusat",
      price: 25000000000,
      image: "/rumah-2.jpg",
    },
    application: {
      number: "KPR-2025-009",
      date: "18 Oktober 2025",
      status: "Analisa Kredit",
      officer: "Rizky Ananda",
      branch: "BNI KCU Thamrin",
    },
    loan: {
      principal: 12500000000,
      downPayment: 3000000000,
      tenorYears: 20,
      interest: "5.75% Fixed 5 Tahun",
      monthlyInstallment: 72500000,
      akadDate: "25 Oktober 2025",
    },
    balance: {
      remainingTenor: 240,
      totalPaid: 580000000,
      outstanding: 11820000000,
    },
    timeline: [
      { step: "Pengajuan Terkirim", status: "Selesai" },
      { step: "Verifikasi Dokumen", status: "Selesai" },
      { step: "Review", status: "Selesai" },
      { step: "Diterima / Ditolak", status: "Proses" },
    ],
    payments: [
      { month: "September 2025", date: "10-09-2025", amount: 72500000, status: "Lunas" },
      { month: "Oktober 2025", date: "10-10-2025", amount: 72500000, status: "Pending" },
    ],
    account: {
      owner: "Sinta Rahmawati",
      number: "987654321",
      bank: "BNI Thamrin",
      va: "9888899910000001",
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

  const f = (n: number) => n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Detail Pengajuan KPR</h1>

      {/* ====== INFORMASI PROPERTI + INFO PENGAJUAN ====== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Informasi Properti</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-20 rounded-lg overflow-hidden border">
              <Image src={data.property.image} alt="Properti" fill className="object-cover" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{data.property.name}</p>
              <p className="text-gray-500 text-sm">{data.property.city}</p>
              <p className="text-orange-600 font-semibold">{f(data.property.price)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Info Pengajuan</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Nomor Aplikasi: <strong>{data.application.number}</strong></li>
            <li>Tanggal Pengajuan: <strong>{data.application.date}</strong></li>
            <li>Status: <strong>{data.application.status}</strong></li>
            <li>Petugas KPR: <strong>{data.application.officer}</strong></li>
            <li>Cabang: <strong>{data.application.branch}</strong></li>
          </ul>
        </div>
      </section>

      {/* ====== DETAIL PINJAMAN + OUTSTANDING ====== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Detail Pinjaman</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Jumlah Pinjaman: <strong>{f(data.loan.principal)}</strong></li>
            <li>Uang Muka: <strong>{f(data.loan.downPayment)}</strong></li>
            <li>Tenor: <strong>{data.loan.tenorYears} Tahun</strong></li>
            <li>Bunga: <strong>{data.loan.interest}</strong></li>
            <li>Tanggal Akad: <strong>{data.loan.akadDate}</strong></li>
            <li>Angsuran / Bulan: <strong>{f(data.loan.monthlyInstallment)}</strong></li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-orange-500" /> Sisa Outstanding & Tenor
          </h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Sisa Tenor: <strong>{data.balance.remainingTenor} bulan</strong></li>
            <li>Total Dibayar: <strong>{f(data.balance.totalPaid)}</strong></li>
            <li>Sisa Outstanding: <strong>{f(data.balance.outstanding)}</strong></li>
          </ul>

          <div className="mt-4 h-24 flex items-end gap-3">
            <div className="flex-1 bg-orange-200 rounded-md h-[60%]" title="Total Paid"></div>
            <div className="flex-1 bg-gray-300 rounded-md h-[90%]" title="Outstanding"></div>
          </div>
        </div>
      </section>

      {/* ====== TIMELINE PENGAJUAN ====== */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="font-semibold text-lg text-gray-800 mb-4">Timeline Pengajuan</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {data.timeline.map((t, i) => (
            <div key={i} className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${t.status === "Selesai" ? "bg-green-500" : "bg-gray-300"}`} />
                <p className="text-sm font-medium text-gray-800">{t.step}</p>
              </div>
              <p className="ml-5 text-sm text-gray-500">{t.status}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== HISTORY PEMBAYARAN + INFO REKENING ====== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">History Pembayaran</h2>
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
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Info Rekening</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Nama Pemilik: <strong>{data.account.owner}</strong></li>
            <li>Nomor Rekening: <strong>{data.account.number}</strong></li>
            <li>Bank Tujuan: <strong>{data.account.bank}</strong></li>
            <li>Virtual Account: <strong>{data.account.va}</strong></li>
            <li>Metode: <strong>{data.account.method}</strong></li>
          </ul>
        </div>
      </section>

      {/* ====== NOTIFIKASI TAGIHAN ====== */}
      {data.payments.some((p) => p.status === "Pending") && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <p>
            Tagihan bulan ini belum dibayar.{" "}
            <a href="#" className="underline font-medium">
              Bayar Sekarang
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
