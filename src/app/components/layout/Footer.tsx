"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";


const quickLinks = [
  { href: "/user/beranda", label: "Beranda" },
  { href: "/user/cari-rumah", label: "Cari Rumah" },
  { href: "/user/simulasi", label: "Simulasi" },
];

const contactInfo = [
  { icon: Phone, text: "1500046" },
  { icon: Mail, text: "kpr@bni.co.id" },
  { icon: MapPin, text: "Jl. Jenderal Sudirman Kav. 1, Jakarta Pusat 10220" },
];

// Data untuk ikon sosial media (tidak berubah)
const socialLinks = [
    { href: "https://www.facebook.com/BNI", icon: Facebook },
    { href: "https://www.instagram.com/bni46/", icon: Instagram },
    { href: "https://x.com/BNI", icon: Twitter },
    { href: "https://www.linkedin.com/company/pt-bank-negara-indonesia-persero-tbk-/", icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="bg-bni-orange text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Info Perusahaan & Social Media */}
          <div className="lg:col-span-2">
            
            {/* 2. Ganti blok "BNI KPR" dengan logo "satuatap" */}
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 bg-white rounded-md p-1">
                <Image src="/logo_footer.png" alt="SatuAtap Logo" fill className="object-contain" />
              </div>
              <span className="text-3xl font-extrabold text-white">About Us</span>
            </Link>

            {/* 3. Sesuaikan teks deskripsi */}
            <p className="leading-relaxed max-w-md mb-6 !text-white">
              Wujudkan impian rumah Anda bersama satuatap. Kami berkomitmen memberikan layanan KPR terbaik dengan proses yang aman, mudah dan cepat.
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
            <h3 className="font-bold mb-5 text-lg tracking-wider not-prose !text-white underline !decoration-white decoration-inherit underline-offset-4">
              Navigasi
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="opacity-80 hover:opacity-100 hover:underline transition-opacity duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Kontak */}
          <div>
            <h3 className="font-bold mb-5 text-lg tracking-wider not-prose !text-white underline !decoration-white decoration-inherit underline-offset-4">Hubungi Kami</h3>
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
          <p>© {new Date().getFullYear()} Kelompok 1 ODP BNI Batch 343 | Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}