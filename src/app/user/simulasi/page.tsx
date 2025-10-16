// src/app/user/simulasi/page.tsx

'use client';

import { useState, useMemo } from 'react';

// ----- Types -----
type AmortizationRow = {
  month: number;
  principalComponent: number;
  interestComponent: number;
  payment: number;
  balance: number;
  rateApplied: number;
};

// ----- Helper Functions -----
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ----- Reusable Components -----
interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
}

const SliderInput = ({ label, value, min, max, step, onChange, formatValue }: SliderInputProps) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="text-gray-600 font-medium">{label}</label>
      <span className="font-bold text-gray-800 text-lg">{formatValue(value)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bni-teal
                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bni-teal
                 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-bni-teal"
    />
  </div>
);

// ============================================================================
// KOMPONEN UTAMA HALAMAN SIMULASI
// ============================================================================
export default function SimulasiKprPage() {
  // State untuk input simulasi
  const [hargaProperti, setHargaProperti] = useState(500000000);
  const [persenDP, setPersenDP] = useState(20);
  const [sukuBunga, setSukuBunga] = useState(6.5);
  const [jangkaWaktu, setJangkaWaktu] = useState(15);
  
  // State untuk pagination tabel
  const [page, setPage] = useState(1);
  const pageSize = 12; // Tampilkan 12 bulan (1 tahun) per halaman

  // ============================================================================
  // LOGIKA KALKULASI DAN PEMBUATAN TABEL (DIADAPTASI DARI KODE ANDA)
  // ============================================================================
  const { rows, totalPembayaran, totalBunga, jumlahPinjaman } = useMemo(() => {
    const loanAmount = hargaProperti - (hargaProperti * (persenDP / 100));
    const tenorInMonths = jangkaWaktu * 12;

    const buildAnnuitySchedule = (P: number, months: number, rateAnnual: number): AmortizationRow[] => {
      const r = rateAnnual / 100 / 12;
      if (months <= 0 || P <= 0) return [];
      const pay = r === 0 ? P / months : (P * r) / (1 - Math.pow(1 + r, -months));
      const schedule: AmortizationRow[] = [];
      let balance = P;
      for (let i = 1; i <= months; i++) {
        const interest = balance * r;
        const principal = Math.min(balance, pay - interest);
        balance = Math.max(0, balance - principal);
        schedule.push({
          month: i,
          principalComponent: principal,
          interestComponent: interest,
          payment: principal + interest,
          balance,
          rateApplied: rateAnnual,
        });
      }
      return schedule;
    };

    const scheduleRows = buildAnnuitySchedule(loanAmount, tenorInMonths, sukuBunga);
    const payment = scheduleRows.reduce((sum, row) => sum + row.payment, 0);
    const interest = scheduleRows.reduce((sum, row) => sum + row.interestComponent, 0);

    return {
      rows: scheduleRows,
      totalPembayaran: payment,
      totalBunga: interest,
      jumlahPinjaman: loanAmount,
    };
  }, [hargaProperti, persenDP, sukuBunga, jangkaWaktu]);

  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const maxPage = Math.ceil(rows.length / pageSize);
  const cicilanPerBulan = rows[0]?.payment ?? 0;

  return (
    <div className="min-h-screen bg-brand-bg-light py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
          Simulasi KPR
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Kolom Kiri: Input Form */}
          <div className="bg-white rounded-2xl p-8 space-y-8 shadow-sm border">
            <SliderInput
              label="Harga Properti"
              value={hargaProperti}
              min={100000000}
              max={5000000000}
              step={10000000}
              onChange={setHargaProperti}
              formatValue={(val) => formatCurrency(val)}
            />
             <SliderInput
              label="Uang Muka (DP)"
              value={persenDP}
              min={10}
              max={80}
              step={5}
              onChange={setPersenDP}
              formatValue={(val) => `${val}% (${formatCurrency(hargaProperti * (val/100))})`}
            />
            <SliderInput
              label="Suku Bunga (% per tahun)"
              value={sukuBunga}
              min={3}
              max={15}
              step={0.25}
              onChange={setSukuBunga}
              formatValue={(val) => `${val.toFixed(2)}%`}
            />
            <SliderInput
              label="Jangka Waktu (tahun)"
              value={jangkaWaktu}
              min={1}
              max={30}
              step={1}
              onChange={setJangkaWaktu}
              formatValue={(val) => `${val} tahun`}
            />
          </div>

          {/* Kolom Kanan: Hasil Simulasi */}
          <div className="bg-brand-card-bg rounded-2xl p-8 space-y-6 shadow-sm border border-red-100">
            <h2 className="text-xl font-bold text-gray-800">Hasil Simulasi</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Cicilan per bulan</p>
                <p className="text-3xl font-extrabold text-gray-900">{formatCurrency(cicilanPerBulan)}</p>
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Jumlah Pinjaman</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(jumlahPinjaman)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Bunga</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(totalBunga)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Pembayaran</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(totalPembayaran)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
            <button className="bg-bni-orange text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105">
                Lanjut Ajukan KPR
            </button>
        </div>

        {/* ============================================================================ */}
        {/* BAGIAN BARU: TABEL Rincian Angsuran */}
        {/* ============================================================================ */}
        <section className="mt-16 bg-white rounded-2xl p-8 shadow-sm border">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Rincian Tabel Angsuran</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Bulan Ke-</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Angsuran Pokok</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Angsuran Bunga</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Total Angsuran</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Sisa Pinjaman</th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((row) => (
                  <tr key={row.month} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{row.month}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(row.principalComponent)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(row.interestComponent)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(row.payment)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination untuk Tabel */}
          {rows.length > 0 && (
            <div className="flex justify-between items-center mt-6 text-sm">
              <span className="text-gray-600">Menampilkan {pagedRows.length} dari {rows.length} baris</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-lg border bg-white font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={page === maxPage}
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  className="px-4 py-2 rounded-lg border bg-white font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}