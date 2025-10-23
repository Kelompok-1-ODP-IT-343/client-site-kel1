// src/app/user/simulasi/page.tsx
'use client'

import { Plus, Trash2, SlidersHorizontal, FileText, BarChart3, Settings2 } from 'lucide-react'
import React, { JSX, useMemo, useState, useEffect } from "react";

// ====== Types ======
type AmortizationRow = {
  month: number
  principalComponent: number
  interestComponent: number
  payment: number
  balance: number
  rateApplied: number
}

// ====== Helper ======
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)

// ====== SliderInput ======
interface SliderInputProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  formatValue: (value: number) => string
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: SliderInputProps) {
  return (
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
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bni-teal
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bni-teal"
      />
    </div>
  )
}

// ============================================================================
// === HALAMAN SIMULASI KPR MULTI-RATE ===
// ============================================================================
export default function SimulasiKprPage() {
  const [hargaProperti, setHargaProperti] = useState(850_000_000)
  const [persenDP, setPersenDP] = useState(20)
  const [jangkaWaktu, setJangkaWaktu] = useState(20)

  const tenor = jangkaWaktu * 12
  const loanAmount = hargaProperti * (1 - persenDP / 100)

  const [rateSegments, setRateSegments] = useState([
    { start: 1, end: 12, rate: 5.99 },
    { start: 13, end: 240, rate: 13.5 },
  ])

  // Sinkronisasi otomatis kalau tenor berubah
  useEffect(() => {
    setRateSegments((prev) => {
      if (prev.length === 0) {
        return [{ start: 1, end: tenor, rate: 5.99 }]
      }
      const last = prev[prev.length - 1]
      if (last.end !== tenor) {
        return prev.map((seg, i) =>
          i === prev.length - 1 ? { ...seg, end: tenor } : seg
        )
      }
      return prev
    })
  }, [tenor])

  // === Kalkulasi Amortisasi ===
function buildMultiSegmentSchedule(
  principal: number,
  segments: { start: number; end: number; rate: number }[]
): AmortizationRow[] {
  const rows: AmortizationRow[] = []
  let balance = principal

  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s]
    const months = seg.end - seg.start + 1
    if (months <= 0 || balance <= 0) continue

    const r = seg.rate / 100 / 12

    // hitung ulang payment memakai saldo tersisa dari segmen sebelumnya
    const pay = (balance * r) / (1 - Math.pow(1 + r, -(months + (segments.length - s - 1) * 12)))

    for (let i = 0; i < months; i++) {
      const interest = balance * r
      const principalComp = pay - interest
      balance -= principalComp
      if (balance < 0) balance = 0

      rows.push({
        month: seg.start + i,
        principalComponent: principalComp,
        interestComponent: interest,
        payment: pay,
        balance,
        rateApplied: seg.rate,
      })
    }
  }

  return rows
}

  

  const { rows, totalPembayaran, totalBunga } = useMemo(() => {
    if (rateSegments.length === 0) return { rows: [], totalPembayaran: 0, totalBunga: 0 }

    const schedule = buildMultiSegmentSchedule(loanAmount, rateSegments)
    const totalPay = schedule.reduce((sum, r) => sum + r.payment, 0)
    const totalInt = schedule.reduce((sum, r) => sum + r.interestComponent, 0)
    return { rows: schedule, totalPembayaran: totalPay, totalBunga: totalInt }
  }, [loanAmount, rateSegments, tenor])

  const pageSize = 12
  const [page, setPage] = useState(1)
  const paged = rows.slice((page - 1) * pageSize, page * pageSize)
  // const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize)
  const maxPage = Math.ceil(rows.length / pageSize)
  const cicilanPerBulan = rows[0]?.payment ?? 0
  // === State baru ===
  const [developerType, setDeveloperType] = useState<"A" | "B">("A")
  const [schemeType, setSchemeType] = useState<"single_fixed" | "tiered">("single_fixed")
  const [selectedRates, setSelectedRates] = useState<Record<string, number>>({})

  type RateTable = Record<string, number>
  type DeveloperRates = Record<string, RateTable>
  // tambahan type baru
  type RateSegment = {
    start: number;
    end: number;
    rate: number;
    label?: string
  };
  type RateScheme = Record<"A" | "B", DeveloperRates>
  const colors = {
    blue: "#3FD8D4",
    gray: "#757575",
    orange: "#FF8500",
  } as const;
  function roundIDR(n: number): number {
    return Math.round(n);
  }
  // === Data referensi ===
  const rateData: Record<
    "single_fixed" | "tiered",
    Record<"A" | "B", Record<string, Record<string, number>>>
  > = {
    single_fixed: {
      A: {
        "1":  { "Bunga Tetap 1 Tahun": 7.75 },
        "2":  { "Bunga Tetap 2 Tahun": 7.75 },
        "3":  { "Bunga Tetap 1 Tahun": 2.75, "Bunga Tetap 3 Tahun": 7.75 },
        "4":  { "Bunga Tetap 4 Tahun": 8.00 },
        "5":  { "Bunga Tetap 3 Tahun": 6.75, "Bunga Tetap 5 Tahun": 8.00 },
        "6":  { "Bunga Tetap 6 Tahun": 8.00 },
        "7":  { "Bunga Tetap 7 Tahun": 8.00 },
        "8":  { "Bunga Tetap 8 Tahun": 8.00 },
        "9":  { "Bunga Tetap 9 Tahun": 8.25 },
        "10": { "Bunga Tetap 3 Tahun": 3.75, "Bunga Tetap 5 Tahun": 5.75, "Bunga Tetap 10 Tahun": 8.25 },
        "12": { "Bunga Tetap 5 Tahun": 4.75 },
        "15": { "Bunga Tetap 3 Tahun": 2.75, "Bunga Tetap 5 Tahun": 3.75 },
        "20": { "Bunga Tetap 3 Tahun": 4.00, "Bunga Tetap 5 Tahun": 6.00, "Bunga Tetap 10 Tahun": 8.50 },
        "25": { "Bunga Tetap 3 Tahun": 4.25, "Bunga Tetap 5 Tahun": 6.25, "Bunga Tetap 10 Tahun": 8.75 },
        "30": { "Bunga Tetap 3 Tahun": 4.50, "Bunga Tetap 5 Tahun": 6.50, "Bunga Tetap 10 Tahun": 9.00 }
      },
      B: {
        "1":  { "Bunga Tetap 1 Tahun": 8.00 },
        "2":  { "Bunga Tetap 2 Tahun": 8.00 },
        "3":  { "Bunga Tetap 1 Tahun": 3.25, "Bunga Tetap 3 Tahun": 8.00 },
        "4":  { "Bunga Tetap 4 Tahun": 8.25 },
        "5":  { "Bunga Tetap 3 Tahun": 7.25, "Bunga Tetap 5 Tahun": 8.25 },
        "6":  { "Bunga Tetap 6 Tahun": 8.25 },
        "7":  { "Bunga Tetap 7 Tahun": 8.25 },
        "8":  { "Bunga Tetap 8 Tahun": 8.25 },
        "9":  { "Bunga Tetap 9 Tahun": 8.75 },
        "10": { "Bunga Tetap 3 Tahun": 4.25, "Bunga Tetap 5 Tahun": 6.25, "Bunga Tetap 10 Tahun": 8.75 },
        "12": { "Bunga Tetap 5 Tahun": 5.25 },
        "15": { "Bunga Tetap 3 Tahun": 3.25, "Bunga Tetap 5 Tahun": 4.25 },
        "20": { "Bunga Tetap 3 Tahun": 4.75, "Bunga Tetap 5 Tahun": 6.75, "Bunga Tetap 10 Tahun": 9.25 },
        "25": { "Bunga Tetap 3 Tahun": 5.25, "Bunga Tetap 5 Tahun": 7.25, "Bunga Tetap 10 Tahun": 9.75 },
        "30": { "Bunga Tetap 3 Tahun": 5.75, "Bunga Tetap 5 Tahun": 7.75, "Bunga Tetap 10 Tahun": 10.25 }
      },
    },

    tiered: {
      A: {
        "10": { "Tahun ke 1": 2.75, "Tahun ke 2": 4.75, "Tahun ke 3": 6.75, "Tahun ke 4": 8.75, "Tahun ke 5-10": 10.75 },
        "15": { "Tahun ke 1": 2.75, "Tahun ke 2-3": 4.75, "Tahun ke 4-5": 6.75, "Tahun ke 6-7": 8.75, "Tahun ke 8-10": 10.75 },
        "20": { "Tahun ke 1": 3.00, "Tahun ke 2-3": 5.00, "Tahun ke 4-5": 7.00, "Tahun ke 6-10": 9.00, "Tahun ke 11-15": 10.50, "Tahun ke 16-20": 11.00 },
        "25": { "Tahun ke 1": 3.25, "Tahun ke 2-3": 5.25, "Tahun ke 4-5": 7.25, "Tahun ke 6-10": 9.25, "Tahun ke 11-15": 10.75, "Tahun ke 16-20": 11.25, "Tahun ke 21-25": 11.75 },
        "30": { "Tahun ke 1": 3.50, "Tahun ke 2-3": 5.50, "Tahun ke 4-5": 7.50, "Tahun ke 6-10": 9.50, "Tahun ke 11-15": 11.00, "Tahun ke 16-20": 11.50, "Tahun ke 21-25": 12.00, "Tahun ke 26-30": 12.50 }
      },
      B: {
        "10": { "Tahun ke 1": 3.25, "Tahun ke 2": 5.25, "Tahun ke 3": 7.25, "Tahun ke 4": 9.25, "Tahun ke 5-10": 11.25 },
        "15": { "Tahun ke 1": 3.25, "Tahun ke 2-3": 5.25, "Tahun ke 4-5": 7.25, "Tahun ke 6-7": 9.25, "Tahun ke 8-10": 11.25 },
        "20": { "Tahun ke 1": 3.50, "Tahun ke 2-3": 5.50, "Tahun ke 4-5": 7.50, "Tahun ke 6-10": 9.50, "Tahun ke 11-15": 11.50, "Tahun ke 16-20": 12.00 },
        "25": { "Tahun ke 1": 3.75, "Tahun ke 2-3": 5.75, "Tahun ke 4-5": 7.75, "Tahun ke 6-10": 9.75, "Tahun ke 11-15": 11.75, "Tahun ke 16-20": 12.25, "Tahun ke 21-25": 12.75 },
        "30": { "Tahun ke 1": 4.25, "Tahun ke 2-3": 6.25, "Tahun ke 4-5": 8.25, "Tahun ke 6-10": 10.25, "Tahun ke 11-15": 12.25, "Tahun ke 16-20": 12.75, "Tahun ke 21-25": 13.25, "Tahun ke 26-30": 13.75 }
      },
    },
  } 

  React.useEffect(() => {
    const data = rateData[schemeType]?.[developerType]?.[String(jangkaWaktu)];
    if (!data) {
      setSelectedRates({});
      setRateSegments([]);
      return;
    }

    setSelectedRates(data);

    // 🔹 SINGLE FIXED → manual pilih segmen
    if (schemeType === "single_fixed") {
      const segments: RateSegment[] = [];
      let totalYears = 0;

      Object.entries(data).forEach(([label, rate]) => {
        const match = label.match(/(\d+)/);
        const years = match ? parseInt(match[1]) : 0;
        const start = totalYears * 12 + 1;
        const end = (totalYears + years) * 12;
        segments.push({ start, end, rate: rate as number, label });
        totalYears += years;
      });

      if (totalYears < jangkaWaktu) {
        segments.push({
          start: totalYears * 12 + 1,
          end: jangkaWaktu * 12,
          rate: 0,
          label: "Bunga Floating",
        });
      }

      setRateSegments(segments);
    }

    // 🔹 TIERED → otomatis parse "Tahun ke X" dan "Tahun ke X-Y"
    if (schemeType === "tiered") {
      const segments: RateSegment[] = [];

      Object.entries(data).forEach(([label, rate]) => {
        // Contoh label: "Tahun ke 1", "Tahun ke 2-3", "Tahun ke 4-5", "Tahun ke 6-10"
        const match = label.match(/Tahun ke (\d+)(?:-(\d+))?/i);
        if (match) {
          const startYear = parseInt(match[1]);
          const endYear = match[2] ? parseInt(match[2]) : startYear;
          const start = (startYear - 1) * 12 + 1;
          const end = endYear * 12;
          segments.push({
            start,
            end,
            rate: rate as number,
            label,
          });
        }
      });

      setRateSegments(segments);
    }

  }, [developerType, schemeType, jangkaWaktu]);

  // ========================================================================
  return (
    <div className="min-h-screen bg-brand-bg-light py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* GRID UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_2fr] gap-8 items-start">
          {/* === KIRI: Hasil Simulasi === */}
          <div className="flex flex-col gap-8">
            {/* === HASIL SIMULASI === */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-bni-orange" />
                Hasil Simulasi
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Cicilan per bulan (awal)</p>
                  <p className="text-4xl font-extrabold text-gray-900">
                    {formatCurrency(cicilanPerBulan)}
                  </p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Jumlah Pinjaman</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Bunga</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(totalBunga)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Pembayaran</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(totalPembayaran)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* === PENGATURAN + MULTI RATE === */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings2 className="h-6 w-6 text-bni-orange" />
                Pengaturan KPR
              </h2>

              <div className="space-y-8">
                <SliderInput
                  label="Harga Properti"
                  value={hargaProperti}
                  min={100_000_000}
                  max={5_000_000_000}
                  step={10_000_000}
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
                  formatValue={(val) => `${val}% (${formatCurrency(hargaProperti * (val / 100))})`}
                />
                {/* <SliderInput
                  label="Jangka Waktu (tahun)"
                  value={jangkaWaktu}
                  min={1}
                  max={30}
                  step={1}
                  onChange={setJangkaWaktu}
                  formatValue={(val) => `${val} tahun (${val * 12} bulan)`}
                /> */}

                {/* === PENYESUAIAN MULTI-RATE === */}
                <div
                  className="mb-4 border rounded-lg p-3"
                  style={{ borderColor: colors.gray + "33" }}
                >
                  <p className="text-sm font-medium mb-3 text-gray-700">Penyesuaian Bunga Otomatis</p>

                  {/* Pilihan Developer */}
                  <div className="mb-3">
                    <label className="text-xs font-medium text-gray-600">Pilih Tipe Developer</label>
                    <select
                      className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                      value={developerType}
                      onChange={(e) => setDeveloperType(e.target.value as "A" | "B")}
                    >
                      <option value="A">🏠 Top Selected Developer</option>
                      <option value="B">🏗️ Developer Kerjasama</option>
                    </select>
                  </div>

                  {/* Pilihan Jenis Bunga */}
                  <div className="mb-3">
                    <label className="text-xs font-medium text-gray-600">Jenis Skema Bunga</label>
                    <select
                      className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                      value={schemeType}
                      onChange={(e) => setSchemeType(e.target.value as "single_fixed" | "tiered")}
                    >
                      <option value="single_fixed">🔒 Single Fixed</option>
                      <option value="tiered">🪜 Tiered Rate</option>
                    </select>
                  </div>

                  {/* TENOR */}
                  <div className="mb-3">
                    <label className="text-xs font-medium text-gray-600">Pilih Tenor (tahun)</label>
                    <select
                      className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                      value={jangkaWaktu}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setJangkaWaktu(val)
                        const data = rateData[schemeType]?.[developerType]?.[String(val)]
                        if (data) setSelectedRates(data)
                        else {
                          setSelectedRates({})
                          setRateSegments([])
                        }
                      }}
                    >
                      <option value="">-- Pilih Tenor --</option>
                      {Object.keys(rateData[schemeType]?.[developerType] || {}).map((key) => (
                        <option key={key} value={key}>
                          {key} tahun
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pilihan Segmen Bunga (khusus single_fixed saja) */}
                  {schemeType === "single_fixed" && Object.keys(selectedRates).length > 0 && (
                    <div className="mb-3">
                      <label className="text-xs font-medium text-gray-600">Pilih Segmen Bunga</label>
                      <select
                        className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                        onChange={(e) => {
                          const label = e.target.value
                          const rate = selectedRates[label]
                          if (rate) {
                            const match = label.match(/(\d+)/)
                            const years = match ? parseInt(match[1]) : 0
                            const end = years * 12
                            const totalMonths = jangkaWaktu * 12
                            const segments: RateSegment[] = [
                              { start: 1, end, rate, label },
                            ]

                            if (end < totalMonths) {
                              segments.push({
                                start: end + 1,
                                end: totalMonths,
                                rate: 0,
                                label: "Bunga Floating",
                              })
                            }
                            setRateSegments(segments)
                          }
                        }}
                      >
                        <option value="">-- Pilih Segmen --</option>
                        {Object.entries(selectedRates).map(([label, value]) => (
                          <option key={label} value={label}>
                            {label} ({value}%)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}



                  {/* Preview bunga terpilih */}
                  <div className="mt-4 bg-gray-50 border rounded-lg p-3 text-sm space-y-1">
                    <p className="font-medium text-gray-800">Bunga Berlaku:</p>
                    {Object.entries(selectedRates).map(([label, value]) => (
                      <div key={label} className="flex justify-between border-b last:border-none pb-1">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-semibold text-gray-900">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === KANAN: TABEL ANGSURAN === */}
          <div className="rounded-2xl bg-white p-5" style={{ borderColor: colors.gray + "33" }}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-bni-orange" />
                  Rincian Angsuran
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto border rounded-lg text-gray-600" style={{ borderColor: colors.gray + "45" }}>
              <table className="min-w-full text-sm ">
                <thead style={{ background: colors.orange + "11", color: colors.gray  }}>
                  <tr>
                    <th className="px-4 py-2">Bulan</th>
                    <th className="px-4 py-2">Pokok</th>
                    <th className="px-4 py-2">Bunga</th>
                    <th className="px-4 py-2">Angsuran</th>
                    <th className="px-4 py-2">Sisa</th>
                    <th className="px-4 py-2">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((r) => (
                    <tr key={r.month} className="border-t" style={{ borderColor: colors.gray + "33" }}>
                      <td className="px-4 py-2">{r.month}</td>

                      {r.rateApplied === 0 ? (
                        <>
                          <td className="px-4 py-2 italic text-gray-400">-</td>
                          <td className="px-4 py-2 italic text-gray-400">-</td>
                          <td className="px-4 py-2 italic text-gray-400">-</td>
                          <td className="px-4 py-2 italic text-gray-400">-</td>
                          <td className="px-4 py-2 font-medium text-[#FF8500]">Bunga Floating</td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2">Rp{roundIDR(r.principalComponent).toLocaleString("id-ID")}</td>
                          <td className="px-4 py-2">Rp{roundIDR(r.interestComponent).toLocaleString("id-ID")}</td>
                          <td className="px-4 py-2 font-medium text-black">
                            Rp{roundIDR(r.payment).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-2">Rp{roundIDR(r.balance).toLocaleString("id-ID")}</td>
                          <td className="px-4 py-2">{r.rateApplied.toFixed(2)}%</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Halaman {page} / {maxPage}</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                  style={{ borderColor: colors.orange, color: colors.orange }}
                >
                  Prev
                </button>
                <button
                  disabled={page === maxPage}
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                  style={{ borderColor: colors.orange, color: colors.orange }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
