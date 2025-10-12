"use client";

import { useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SimulasiKPRUser() {
  const [pinjaman, setPinjaman] = useState(350_000_000);
  const [bungaTahunan, setBungaTahunan] = useState(6.5);
  const [tenorTahun, setTenorTahun] = useState(15);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Math.round(amount));

  const { cicilanBulanan, totalPembayaran, totalBunga } = useMemo(() => {
    const r = bungaTahunan / 100 / 12;
    const n = tenorTahun * 12;
    const pembayaranPerBulan =
      r === 0 ? pinjaman / n : pinjaman * (r / (1 - Math.pow(1 + r, -n)));
    const totalBayar = pembayaranPerBulan * n;
    const totalInterest = totalBayar - pinjaman;
    return {
      cicilanBulanan: pembayaranPerBulan,
      totalPembayaran: totalBayar,
      totalBunga: totalInterest,
    };
  }, [pinjaman, bungaTahunan, tenorTahun]);

  // Buat tabel amortisasi sederhana (12 bulan pertama)
  const amortisasiData = useMemo(() => {
    const data = [];
    let sisaPinjaman = pinjaman;
    const r = bungaTahunan / 100 / 12;
    for (let i = 1; i <= 12; i++) {
      const bungaBulan = sisaPinjaman * r;
      const pokok = cicilanBulanan - bungaBulan;
      sisaPinjaman -= pokok;
      data.push({
        bulan: i,
        bunga: bungaBulan,
        pokok: pokok,
        total: cicilanBulanan,
        sisa: sisaPinjaman > 0 ? sisaPinjaman : 0,
      });
    }
    return data;
  }, [pinjaman, bungaTahunan, tenorTahun, cicilanBulanan]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Judul */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
            Simulasi KPR
          </h1>

          {/* Grid utama */}
          <div className="grid md:grid-cols-2 gap-10">
            {/* Input sisi kiri */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <div className="space-y-8">
                <div>
                  <p className="text-base font-semibold text-gray-800 mb-2">
                    Jumlah Pinjaman
                  </p>
                  <input
                    type="range"
                    min={50_000_000}
                    max={5_000_000_000}
                    step={10_000_000}
                    value={pinjaman}
                    onChange={(e) => setPinjaman(Number(e.target.value))}
                    className="w-full accent-[#FF8500]"
                  />
                  <p className="mt-2 font-bold text-[#0f766e]">
                    {formatRupiah(pinjaman)}
                  </p>
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-800 mb-2">
                    Suku Bunga (% per tahun)
                  </p>
                  <input
                    type="range"
                    min={3}
                    max={15}
                    step={0.1}
                    value={bungaTahunan}
                    onChange={(e) => setBungaTahunan(Number(e.target.value))}
                    className="w-full accent-[#FF8500]"
                  />
                  <p className="mt-2 font-bold text-[#0f766e]">
                    {bungaTahunan.toFixed(1)}%
                  </p>
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-800 mb-2">
                    Jangka Waktu (tahun)
                  </p>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={tenorTahun}
                    onChange={(e) => setTenorTahun(Number(e.target.value))}
                    className="w-full accent-[#FF8500]"
                  />
                  <p className="mt-2 font-bold text-[#0f766e]">
                    {tenorTahun} tahun
                  </p>
                </div>
              </div>
            </div>

            {/* Hasil sisi kanan */}
            <div className="bg-rose-50 rounded-2xl shadow-md p-8 border border-rose-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                Hasil Simulasi
              </h2>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600">Cicilan per bulan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatRupiah(cicilanBulanan)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pembayaran</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatRupiah(totalPembayaran)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bunga</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatRupiah(totalBunga)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel amortisasi */}
          <div className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Tabel Simulasi 12 Bulan Pertama
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left">
                    <th className="py-2 px-3">Bulan</th>
                    <th className="py-2 px-3">Pokok</th>
                    <th className="py-2 px-3">Bunga</th>
                    <th className="py-2 px-3">Total Cicilan</th>
                    <th className="py-2 px-3">Sisa Pinjaman</th>
                  </tr>
                </thead>
                <tbody>
                  {amortisasiData.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="py-2 px-3 font-medium text-gray-700">
                        {row.bulan}
                      </td>
                      <td className="py-2 px-3">{formatRupiah(row.pokok)}</td>
                      <td className="py-2 px-3">{formatRupiah(row.bunga)}</td>
                      <td className="py-2 px-3">{formatRupiah(row.total)}</td>
                      <td className="py-2 px-3">{formatRupiah(row.sisa)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
