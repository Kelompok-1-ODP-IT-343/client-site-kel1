import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#001F3F] text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="text-3xl font-bold text-[#FF8500]">BNI</div>
              <span className="ml-2 text-lg font-medium">KPR</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              PT Bank Negara Indonesia (Persero) Tbk berkomitmen memberikan
              layanan KPR terbaik untuk mewujudkan impian rumah Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Tautan Cepat</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/user/beranda" className="hover:text-[#FF8500]">Beranda</Link></li>
              <li><Link href="/user/cari-rumah" className="hover:text-[#FF8500]">Cari Rumah</Link></li>
              <li><Link href="/user/simulasi" className="hover:text-[#FF8500]">Simulasi</Link></li>
              <li><Link href="/user/login" className="hover:text-[#FF8500]">Masuk</Link></li>
              <li><Link href="/user/register" className="hover:text-[#FF8500]">Daftar</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Hubungi Kami</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📞 1500046</li>
              <li>✉️ kpr@bni.co.id</li>
              <li>📍 Jl. Jenderal Sudirman Kav. 1 Jakarta Pusat 10220</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          © 2025 PT Bank Negara Indonesia (Persero) Tbk. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
