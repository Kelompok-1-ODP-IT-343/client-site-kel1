"use client";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

export default function Beranda() {
  const properties = [
    { id: 1, name: 'Cluster Green Valley', location: 'Serpong, Banten', price: 456500000 },
    { id: 2, name: 'Cluster Green Valley', location: 'Margonda, Depok', price: 625500000 },
    { id: 3, name: 'PONDOK TAKTAKAN', location: 'Serang, Banten', price: 197000000 },
  ];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-14" style={{ backgroundColor: '#C1F0EC' }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Wujudkan Impian Rumah Anda</h1>
          <p className="mt-2 text-gray-700">KPR BNI dengan bunga kompetitif dan proses yang mudah</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="btn-outline text-sm sm:text-base">Ajukan KPR Sekarang</a>
            <a href="/simulasi" className="btn-outline text-sm sm:text-base">Hitung Simulasi</a>
          </div>
        </div>
      </section>

      {/* Mengapa Memilih KPR BNI */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Mengapa Memilih KPR BNI?</h2>
            <p className="text-gray-600 mt-2">Dapatkan kemudahan dan keuntungan terbaik untuk kepemilikan rumah impian Anda!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="w-16 h-16 bg-bni-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Proses Cepat</h3>
              <p className="text-gray-600 text-sm">Persetujuan kredit dalam 3–5 hari kerja dengan persyaratan yang mudah</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-bni-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Bunga Kompetitif</h3>
              <p className="text-gray-600 text-sm">Suku bunga mulai dari 6.25% dengan berbagai pilihan tenor hingga 25 tahun</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fleksibel</h3>
              <p className="text-gray-600 text-sm">Berbagai pilihan produk KPR sesuai kebutuhan dan kemampuan finansial Anda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eksplor Rumah Impian */}
      <section className="py-12" style={{ backgroundColor: '#ECF789' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Eksplor Rumah Impian</h2>
            <p className="text-gray-600">Tersedia rumah dengan kualitas terbaik dari developer pilihan BNI</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="card hover:shadow-lg transition-shadow">
                <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
                  <Image src="/window.svg" alt={p.name} width={200} height={120} className="object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{p.name}</h3>
                <p className="flex items-center text-sm text-gray-600 mb-2"><MapPin className="w-4 h-4 mr-1" /> {p.location}</p>
                <p className="font-semibold text-gray-900">{formatCurrency(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}