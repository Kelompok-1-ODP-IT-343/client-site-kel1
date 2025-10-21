// src/app/user/simulasi/page.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Trash2, SlidersHorizontal } from 'lucide-react'

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
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize)
  const maxPage = Math.ceil(rows.length / pageSize)
  const cicilanPerBulan = rows[0]?.payment ?? 0

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
                <SlidersHorizontal className="h-6 w-6 text-bni-teal" />
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
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Pengaturan KPR
              </h3>

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
                <SliderInput
                  label="Jangka Waktu (tahun)"
                  value={jangkaWaktu}
                  min={1}
                  max={30}
                  step={1}
                  onChange={setJangkaWaktu}
                  formatValue={(val) => `${val} tahun (${val * 12} bulan)`}
                />

                {/* === PENYESUAIAN MULTI-RATE === */}
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium mb-3 text-gray-700">
                    Penyesuaian Multi-Rate
                  </p>
                  {rateSegments.map((seg, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 mb-2 items-end">
                      <label className="text-xs">
                        Mulai
                        <input
                          type="number"
                          className="w-full border rounded px-2 py-1 mt-1 bg-white text-gray-900"
                          value={seg.start}
                          min={1}
                          max={tenor}
                          onChange={(e) => {
                            const val = Math.max(1, Math.min(+e.target.value, tenor))
                            setRateSegments((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, start: val } : s))
                            )
                          }}
                        />
                      </label>
                      <label className="text-xs">
                        Selesai
                        <input
                          type="number"
                          className="w-full border rounded px-2 py-1 mt-1 bg-white text-gray-900"
                          value={seg.end}
                          min={seg.start}
                          max={tenor}
                          onChange={(e) => {
                            const val = Math.max(seg.start, Math.min(+e.target.value, tenor))
                            setRateSegments((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, end: val } : s))
                            )
                          }}
                        />
                      </label>
                      <label className="text-xs">
                        Rate (%)
                        <input
                          type="number"
                          step="0.01"
                          className="w-full border rounded px-2 py-1 mt-1 bg-white text-gray-900"
                          value={seg.rate}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value || '0')
                            setRateSegments((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, rate: val } : s))
                            )
                          }}
                        />
                      </label>
                      <button
                        onClick={() =>
                          setRateSegments((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="text-red-500 hover:text-red-600 flex items-center gap-1 justify-center"
                      >
                        <Trash2 className="h-4 w-4" /> Hapus
                      </button>
                    </div>
                  ))}
                    <button
                    disabled={
                        rateSegments.length > 0 &&
                        rateSegments[rateSegments.length - 1].end >= tenor
                    }
                    className={`mt-2 flex items-center gap-2 text-sm rounded-lg px-3 py-1 border transition 
                        ${
                        rateSegments.length > 0 &&
                        rateSegments[rateSegments.length - 1].end >= tenor
                            ? 'opacity-50 cursor-not-allowed bg-gray-200 border-gray-300 text-gray-500'
                            : 'text-white bg-[#FF8500] border-[#FF8500] hover:bg-[#e67300]'
                        }`}
                    >
                    <Plus className="h-4 w-4" /> Tambah Segmen
                    </button>


                </div>
              </div>
            </div>
          </div>

          {/* === KANAN: TABEL ANGSURAN === */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Rincian Angsuran
            </h2>
            {rows.length === 0 ? (
              <p className="text-gray-500">Tidak ada data angsuran.</p>
            ) : (
              <>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100">
                      <tr className="text-gray-900 text-sm font-semibold">
                        <th className="px-4 py-3">Bulan</th>
                        <th className="px-4 py-3">Rate (%)</th>
                        <th className="px-4 py-3">Pokok</th>
                        <th className="px-4 py-3">Bunga</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Sisa Pinjaman</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedRows.map((r) => (
                        <tr key={r.month} className="border-t hover:bg-gray-100 transition">
                          <td className="px-4 py-2 text-gray-900">{r.month}</td>
                          <td className="px-4 py-2 text-gray-900 font-semibold">{r.rateApplied.toFixed(2)}</td>
                          <td className="px-4 py-2 text-gray-800">{formatCurrency(r.principalComponent)}</td>
                          <td className="px-4 py-2 text-gray-800">{formatCurrency(r.interestComponent)}</td>
                          <td className="px-4 py-2 font-bold text-gray-900">{formatCurrency(r.payment)}</td>
                          <td className="px-4 py-2 text-gray-800">{formatCurrency(r.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-6 text-sm">
                  <span className="text-gray-600">
                    Menampilkan {pagedRows.length} dari {rows.length} baris
                  </span>
                  <div className="flex gap-2">
                    <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-lg border border-[#3FD8D4] bg-[#3FD8D4] text-white
                                hover:bg-[#34beb9] disabled:opacity-50 disabled:bg-gray-300"
                    >
                    Sebelumnya
                    </button>

                    <button
                    disabled={page === maxPage}
                    onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                    className="px-4 py-2 rounded-lg border border-[#3FD8D4] bg-[#3FD8D4] text-white
                                hover:bg-[#34beb9] disabled:opacity-50 disabled:bg-gray-300"
                    >
                    Berikutnya
                    </button>

                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
