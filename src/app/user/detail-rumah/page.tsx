'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

export default function DetailRumahPage() {
  const title = 'Cluster Green Valley';
  const location = 'Serpong, Banten';
  const price = 1500000000; // Rp 1.500.000.000
  const description =
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white shadow-sm rounded-2xl p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-bni-blue mb-6 text-center">
              {title}
            </h1>

            <div className="grid md:grid-cols-[320px_1fr] gap-8 items-start">
              {/* Image */}
              <div>
                <img
                  src="https://via.placeholder.com/600x400/0066CC/FFFFFF?text=Cluster+Green+Valley"
                  alt={title}
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>

              {/* Right column: info */}
              <div>
                {/* Location */}
                <p className="text-gray-700 font-semibold flex items-center mb-4">
                  <svg className="w-5 h-5 mr-2 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {location}
                </p>

                {/* Price */}
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  {formatRupiah(price)}
                </p>

                {/* Description */}
                <div className="mb-6">
                  <p className="font-semibold mb-2">Deskripsi</p>
                  <p className="text-gray-700 leading-relaxed">{description}</p>
                  <p className="text-gray-700 leading-relaxed mt-2">{description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="btn-primary px-6">Ajukan</button>
                  <button className="btn-outline px-6">Detail</button>
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