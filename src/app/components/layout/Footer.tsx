"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { motion } from "framer-motion";
import { USER_ROUTES } from "@/app/routes/userRoutes";

const quickLinks = [
  { href: USER_ROUTES.BERANDA, label: "Beranda" },
  { href: USER_ROUTES.CARI_RUMAH, label: "Cari Rumah" },
  { href: USER_ROUTES.SIMULASI, label: "Simulasi" },
];

const contactInfo = [
  { icon: Phone, text: "1500046" },
  { icon: Mail, text: "kpr@bni.co.id" },
  { icon: MapPin, text: "Jl. Jenderal Sudirman Kav. 1, Jakarta Pusat 10220" },
];

const socialLinks = [
  { href: "https://www.facebook.com/BNI", icon: Facebook },
  { href: "https://www.instagram.com/bni46/", icon: Instagram },
  { href: "https://x.com/BNI", icon: Twitter },
  {
    href: "https://www.linkedin.com/company/pt-bank-negara-indonesia-persero-tbk-/",
    icon: Linkedin,
  },
];

export default function Footer() {
  return (
    <footer className="bg-bni-orange text-broken-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <Link href="/tentang-kami" className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 bg-broken-white rounded-md p-1">
                <Image
                  src="/logo_footer.png"
                  alt="SatuAtap Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-3xl font-extrabold text-broken-white">
                About Us
              </span>
            </Link>

            <p className="leading-relaxed max-w-md mb-6 !text-broken-white">
              Wujudkan impian rumah Anda bersama satuatap. Kami berkomitmen
              memberikan layanan KPR terbaik dengan proses yang aman, mudah dan
              cepat.
            </p>

            <div className="flex items-center space-x-5">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="group opacity-85 hover:opacity-100 transition"
                  aria-label={`Ikuti kami di ${social.href}`}
                >
                  <social.icon
                    size={22}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-active:translate-y-0"
                  />
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h3 className="font-bold mb-5 text-lg tracking-wider !text-broken-white underline underline-offset-4">
              Navigasi
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative inline-block opacity-90 hover:opacity-100 transition"
                  >
                    {link.label}
                    <span className="absolute left-0 -bottom-0.5 h-[2px] bg-broken-white w-0 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="font-bold mb-5 text-lg tracking-wider !text-broken-white underline underline-offset-4">
              Hubungi Kami
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-3 opacity-95">
                  <item.icon className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="border-t border-[rgba(255,248,231,0.2)] mt-12 pt-8 text-center text-sm opacity-80"
        >
          <p>
            © {new Date().getFullYear()} Kelompok 1 ODP BNI Batch 343 | Hak
            Cipta Dilindungi.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
