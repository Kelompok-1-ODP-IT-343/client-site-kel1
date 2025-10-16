import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

// Data untuk tautan cepat (tidak berubah)
const quickLinks = [
  { href: "/user/beranda", label: "Beranda" },
  { href: "/user/cari-rumah", label: "Cari Rumah" },
  { href: "/user/simulasi", label: "Simulasi" },
];

// Data untuk info kontak (tidak berubah)
const contactInfo = [
  { icon: Phone, text: "1500046" },
  { icon: Mail, text: "kpr@bni.co.id" },
  { icon: MapPin, text: "Jl. Jenderal Sudirman Kav. 1, Jakarta Pusat 10220" },
];

// Data untuk ikon sosial media (tidak berubah)
const socialLinks = [
    { href: "#", icon: Facebook },
    { href: "#", icon: Instagram },
    { href: "#", icon: Twitter },
    { href: "#", icon: Linkedin },
];

export default function Footer() {
  return (
    // Menggunakan warna oranye solid yang Anda berikan
    <footer className="bg-bni-orange text-white w-full">
      {/* Garis pemisah tipis untuk transisi yang lebih halus */}
      <div className="h-px bg-white/20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Info Perusahaan & Social Media */}
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-4xl font-extrabold text-white">BNI</h2>
              <span className="text-2xl font-semibold tracking-wide opacity-90">KPR</span>
            </div>
            <p className="leading-relaxed max-w-md mb-6 opacity-90">
              Wujudkan impian rumah Anda bersama BNI. Kami berkomitmen memberikan layanan KPR terbaik dengan proses yang mudah dan cepat.
            </p>
            <div className="flex items-center space-x-5">
              {socialLinks.map((social, index) => (
                <Link 
                  key={index} 
                  href={social.href} 
                  className="opacity-80 hover:opacity-100 transform hover:scale-110 transition-all duration-300"
                >
                    <social.icon size={22} />
                </Link>
              ))}
            </div>
          </div>

          {/* Tautan Cepat */}
          <div>
            <h3 className="font-bold mb-5 text-lg tracking-wider text-white">Navigasi</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="opacity-80 hover:opacity-100 hover:underline transition-opacity duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Kontak */}
          <div>
            <h3 className="font-bold mb-5 text-lg tracking-wider text-white">Hubungi Kami</h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-3 opacity-90">
                  <item.icon className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Garis Bawah & Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm opacity-70">
          <p>© {new Date().getFullYear()} PT Bank Negara Indonesia (Persero) Tbk. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}