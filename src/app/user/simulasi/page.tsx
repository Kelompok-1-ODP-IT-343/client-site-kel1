'use client';

import { useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function SimulasiKPRUser() {
  const [pinjaman, setPinjaman] = useState(350_000_000);
  const [bungaTahunan, setBungaTahunan] = useState(6.5);
  const [tenorTahun, setTenorTahun] = useState(15);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Math.round(amount));

  const { cicilanBulanan, totalPembayaran, totalBunga } = useMemo(() => {
    const r = bungaTahunan / 100 / 12;
    const n = tenorTahun * 12;
    const pembayaranPerBulan = r === 0 ? pinjaman / n : pinjaman * (r / (1 - Math.pow(1 + r, -n)));
    const totalBayar = pembayaranPerBulan * n;
    const totalInterest = totalBayar - pinjaman;
    return {
      cicilanBulanan: pembayaranPerBulan,
      totalPembayaran: totalBayar,
      totalBunga: totalInterest,
    };
  }, [pinjaman, bungaTahunan, tenorTahun]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Simulasi KPR</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Jumlah Pinjaman</p>
                  <input
                    type="range"
                    min={50_000_000}
                    max={5_000_000_000}
                    step={10_000_000}
                    value={pinjaman}
                    onChange={(e) => setPinjaman(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="mt-2 font-semibold">{formatRupiah(pinjaman)}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Suku Bunga (% per tahun)</p>
                  <input
                    type="range"
                    min={3}
                    max={15}
                    step={0.1}
                    value={bungaTahunan}
                    onChange={(e) => setBungaTahunan(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="mt-2 font-semibold">{bungaTahunan.toFixed(1)}%</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Jangka Waktu (tahun)</p>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={tenorTahun}
                    onChange={(e) => setTenorTahun(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="mt-2 font-semibold">{tenorTahun} tahun</p>
                </div>
              </div>
            </div>

            <div className="card bg-rose-50 border border-rose-100">
              <h2 className="text-xl font-bold mb-6">Hasil Simulasi</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600">Cicilan per bulan</p>
                  <p className="text-2xl font-bold text-gray-900">{formatRupiah(cicilanBulanan)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pembayaran</p>
                  <p className="text-xl font-semibold text-gray-900">{formatRupiah(totalPembayaran)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bunga</p>
                  <p className="text-xl font-semibold text-gray-900">{formatRupiah(totalBunga)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  <Footer />
    </div>
  );
}