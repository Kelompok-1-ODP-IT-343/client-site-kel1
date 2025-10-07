'use client';

import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const [loanAmount, setLoanAmount] = useState(500000000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(15);

  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    return monthlyPayment;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bni-blue to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6">
              Wujudkan Impian Rumah Anda
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl mb-8">
              KPR BNI dengan bunga kompetitif dan proses yang mudah
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="btn-primary text-lg px-8 py-4">
                Ajukan KPR Sekarang
              </a>
              <a href="#kalkulator" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-bni-blue">
                Hitung Simulasi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-4xl font-bold mb-4">
              Mengapa Memilih KPR BNI?
            </h2>
            <p className="section-subtitle text-xl">
              Dapatkan kemudahan dan keuntungan terbaik untuk kepemilikan rumah impian Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card feature-card text-center">
              <div className="w-16 h-16 bg-bni-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Proses Cepat</h3>
              <p>
                Persetujuan kredit dalam 3-5 hari kerja dengan persyaratan yang mudah
              </p>
            </div>

            <div className="card feature-card text-center">
              <div className="w-16 h-16 bg-bni-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Bunga Kompetitif</h3>
              <p>
                Suku bunga mulai dari 6.25% dengan berbagai pilihan tenor hingga 25 tahun
              </p>
            </div>

            <div className="card feature-card text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fleksibel</h3>
              <p>
                Berbagai pilihan produk KPR sesuai kebutuhan dan kemampuan finansial Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-4xl font-bold mb-4">
              Produk KPR BNI
            </h2>
            <p className="section-subtitle text-xl">
              Pilih produk KPR yang sesuai dengan kebutuhan Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card product-card hover:shadow-lg transition-shadow">
              <div className="bg-bni-blue text-white p-4 rounded-t-lg">
                <h3 className="text-xl font-semibold">KPR BNI Reguler</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>Bunga mulai 6.25% per tahun</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>Tenor hingga 25 tahun</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>DP mulai 10%</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>Untuk rumah ready stock</span>
                  </li>
                </ul>
                <a href="/register" className="btn-primary w-full text-center">
                  Pilih Produk
                </a>
              </div>
            </div>

            <div className="card product-card hover:shadow-lg transition-shadow border-2 border-bni-orange">
              <div className="bg-bni-orange text-white p-4 rounded-t-lg relative">
                <h3 className="text-xl font-semibold">KPR BNI Griya</h3>
                <span className="absolute top-2 right-2 text-xs bg-white text-bni-orange px-2 py-1 rounded-full font-semibold">Populer</span>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>Bunga mulai 5.99% per tahun</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>Tenor hingga 25 tahun</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>DP mulai 5%</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>Untuk rumah subsidi</span>
                  </li>
                </ul>
                <a href="/register" className="btn-primary w-full text-center">
                  Pilih Produk
                </a>
              </div>
            </div>

            <div className="card product-card hover:shadow-lg transition-shadow">
              <div className="bg-gray-800 text-white p-4 rounded-t-lg">
                <h3 className="text-xl font-semibold">KPR BNI Platinum</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>Bunga mulai 6.75% per tahun</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>Tenor hingga 30 tahun</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>DP mulai 20%</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2 font-bold">✓</span>
                    <span>Untuk rumah mewah</span>
                  </li>
                </ul>
                <a href="/register" className="btn-primary w-full text-center">
                  Pilih Produk
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="kalkulator" className="calculator-section py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title text-3xl md:text-4xl font-bold mb-4">
                Kalkulator KPR
              </h2>
              <p className="section-subtitle text-xl">
                Hitung estimasi cicilan bulanan KPR Anda
              </p>
            </div>

            <div className="calculator-card bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="calculator-label block text-sm font-medium mb-2">
                      Jumlah Pinjaman
                    </label>
                    <input
                      type="range"
                      min="100000000"
                      max="2000000000"
                      step="50000000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="calculator-value text-center mt-2 text-lg font-semibold">
                      {formatCurrency(loanAmount)}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="calculator-label block text-sm font-medium mb-2">
                      Suku Bunga (% per tahun)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="15"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="calculator-value text-center mt-2 text-lg font-semibold">
                      {interestRate}%
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="calculator-label block text-sm font-medium mb-2">
                      Jangka Waktu (tahun)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="calculator-value text-center mt-2 text-lg font-semibold">
                      {loanTerm} tahun
                    </div>
                  </div>
                </div>

                <div className="calculator-result bg-bni-blue text-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Hasil Simulasi</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="result-label text-sm opacity-90">Cicilan Bulanan</div>
                      <div className="result-value text-2xl font-bold">
                        {formatCurrency(calculateMonthlyPayment())}
                      </div>
                    </div>
                    <div>
                      <div className="result-label text-sm opacity-90">Total Pembayaran</div>
                      <div className="result-value text-xl font-semibold">
                        {formatCurrency(calculateMonthlyPayment() * loanTerm * 12)}
                      </div>
                    </div>
                    <div>
                      <div className="result-label text-sm opacity-90">Total Bunga</div>
                      <div className="result-value text-xl font-semibold">
                        {formatCurrency((calculateMonthlyPayment() * loanTerm * 12) - loanAmount)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <a href="/register" className="btn-secondary w-full text-center bg-white text-bni-blue hover:bg-gray-100">
                      Ajukan KPR Sekarang
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-16 bg-bni-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="cta-title text-3xl md:text-4xl font-bold mb-4">
            Siap Memiliki Rumah Impian?
          </h2>
          <p className="cta-subtitle text-xl mb-8">
            Bergabunglah dengan ribuan nasabah yang telah mempercayai KPR BNI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="btn-secondary bg-white text-bni-blue hover:bg-gray-100 text-lg px-8 py-4">
              Daftar Sekarang
            </a>
            <a href="/login" className="btn-outline border-white text-white hover:bg-white hover:text-bni-blue text-lg px-8 py-4">
              Sudah Punya Akun?
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
