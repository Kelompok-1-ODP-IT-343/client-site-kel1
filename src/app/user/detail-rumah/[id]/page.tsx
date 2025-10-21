// src/app/user/detail-rumah/[id]/page.tsx

"use client";

import { ReactNode, use as usePromise } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
// removed duplicate direct esm import of RulerSquareIcon; using the named import below
import {
  MapPin,
  Home,
  CreditCard,
  ChevronRight,
  BedDouble,
  Bath,
  FileText,
  BadgeInfo,
  Landmark,
  Compass,
  Ruler,
  Layers,
  Car,
  Calendar,
  Wallet,
  Building2,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { allHouses } from "@/app/lib/propertyData";

const fmtNum = (v: unknown) =>
  (v !== null && v !== undefined && String(v).trim() !== "") ? String(v) : "-";

const fmtArea = (v: unknown) =>
  (v !== null && v !== undefined && String(v).trim() !== "") ? `${v} m²` : "-";

export const fmtIDR = (v: unknown, withSpace: boolean = true): string => {
  const raw = typeof v === 'string' ? v.replace(/[^0-9.-]/g, '') : v;
  const n = Number(raw);

  if (!Number.isFinite(n)) return '-';

  const num = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(Math.trunc(n));
  return withSpace ? `Rp ${num}` : `Rp${num}`;
};

export default function PropertyDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = usePromise(paramsPromise);
  const router = useRouter();

  const houseId = parseInt(params.id, 10);
  const house = allHouses.find((h) => h.id === houseId);

  if (!house) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Properti tidak ditemukan.</h1>
      </main>
    );
  }

  const handleAjukanKPR = () => {
    const urlParams = new URLSearchParams({
      propertiId: house.id.toString(),
      propertiNama: house.title,
      propertiLokasi: house.address,
      hargaProperti: String(house.price),
    });
    router.push(`/user/pengajuan?${urlParams.toString()}`);
  };

  const formattedPrice = fmtIDR(house.price);

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/user/cari-rumah" className="hover:underline">
            Cari Rumah
          </Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="font-semibold text-gray-700">Detail Rumah</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          {house.title}
        </h1>
        <p className="mt-1 text-gray-600 flex items-center gap-1.5">
          <MapPin size={16} /> {house.address}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Galeri */}
          <Card title="Galeri Properti" icon={<Home />}>
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
              <Image
                src={house.image}
                alt={house.title}
                fill
                className="object-cover"
              />
            </div>
          </Card>

          {/* Deskripsi & Spesifikasi Lengkap */}
          <Card title="Deskripsi & Spesifikasi" icon={<FileText />}>
            {/* Deskripsi singkat */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">Deskripsi</h3>
            <div className="mb-6 space-y-1 text-gray-700">
              <p className="text-gray-600">{fmtNum(house.description)}</p>
            </div>

            {/* Detail utama */}
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Detail Properti
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm mb-6">
              <InfoItem
                label="Tipe Properti"
                value={fmtNum((house as any).property_type)}
                icon={<BadgeInfo size={16} />}
              />
              <InfoItem
                label="Judul"
                value={fmtNum(house.title)}
                icon={<FileText size={16} />}
              />
            </div>

            {/* Lokasi */}
            <h3 className="text-xl font-bold text-gray-800 mb-3">Lokasi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm mb-6">
              <InfoItem
                label="Alamat"
                value={fmtNum(house.address)}
                icon={<MapPin size={16} />}
              />
              <InfoItem
                label="Kelurahan"
                value={fmtNum((house as any).village)}
                icon={<MapPin size={16} />}
              />
              <InfoItem
                label="Kecamatan"
                value={fmtNum((house as any).district)}
                icon={<MapPin size={16} />}
              />
              <InfoItem
                label="Kota/Kabupaten"
                value={fmtNum((house as any).city)}
                icon={<Landmark size={16} />}
              />
              <InfoItem
                label="Provinsi"
                value={fmtNum((house as any).province)}
                icon={<Landmark size={16} />}
              />
              <InfoItem
                label="Kode Pos"
                value={fmtNum((house as any).postal_code)}
                icon={<MapPin size={16} />}
              />
              <InfoItem
                label="Latitude"
                value={fmtNum((house as any).latitude)}
                icon={<Compass size={16} />}
              />
              <InfoItem
                label="Longitude"
                value={fmtNum((house as any).longitude)}
                icon={<Compass size={16} />}
              />
            </div>

            {/* Spesifikasi Fisik */}
            <h3 className="text-xl font-bold text-gray-800 mb-3">Spesifikasi</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 text-sm mb-6">
              <InfoItem
                label="Kamar Tidur"
                value={fmtNum(house.bedrooms)}
                icon={<BedDouble size={16} />}
              />
              <InfoItem
                label="Kamar Mandi"
                value={fmtNum(house.bathrooms)}
                icon={<Bath size={16} />}
              />
              <InfoItem
                label="Luas Tanah"
                value={fmtArea((house as any).land_area)}
                icon={<Ruler size={16} />}
              />
              <InfoItem
                label="Luas Bangunan"
                value={fmtArea((house as any).building_area)}
                icon={<Ruler size={16} />}
              />
              <InfoItem
                label="Jumlah Lantai"
                value={fmtNum((house as any).floors)}
                icon={<Layers size={16} />}
              />
              <InfoItem
                label="Garasi (mobil)"
                value={fmtNum((house as any).garage)}
                icon={<Car size={16} />}
              />
              <InfoItem
                label="Tahun Dibangun"
                value={fmtNum((house as any).year_built)}
                icon={<Calendar size={16} />}
              />
            </div>

            {/* Finansial & Legal */}
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Finansial & Legal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 text-sm mb-6">
              <InfoItem
                label="Harga"
                value={fmtIDR(house.price)}
                icon={<Wallet size={16} />}
              />
              <InfoItem
                label="Harga/m²"
                value={fmtIDR((house as any).price_per_sqm)}
                icon={<Wallet size={16} />}
              />
              <InfoItem
                label="Biaya Pemeliharaan"
                value={fmtIDR((house as any).maintenance_fee)}
                icon={<Wallet size={16} />}
              />
              <InfoItem
                label="Jenis Sertifikat"
                value={fmtNum((house as any).certificate_type)}
                icon={<BadgeInfo size={16} />}
              />
              <InfoItem
                label="Nilai PBB"
                value={fmtIDR((house as any).pbb_value)}
                icon={<Wallet size={16} />}
              />
            </div>

            {/* Developer */}
            <h3 className="text-xl font-bold text-gray-800 mb-3">Developer</h3>
            <div className="grid grid-cols-1 text-sm">
              <InfoItem
                label="Nama Perusahaan"
                value={fmtNum((house as any).company_name)}
                icon={<Building2 size={16} />}
              />
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-8">
          <div className="sticky top-24">
            <Card title="Harga Properti" icon={<CreditCard />}>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-bni-orange">
                  {formattedPrice}
                </p>
              </div>
            </Card>

            {/* Ajukan KPR */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 text-center">
                Siap Mengajukan KPR?
              </h3>
              <p className="text-center text-sm text-gray-600 mt-1">
                Lanjutkan ke proses pengajuan untuk properti ini.
              </p>
              <button
                onClick={handleAjukanKPR}
                className="mt-4 w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-all"
              >
                Ajukan KPR Sekarang
              </button>

              {/* ✅ Ingin konsultasi (versi sudah benar & rapi) */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-1 flex items-center justify-center gap-1.5">
                  <MessageCircle size={18} className="text-green-600" />
                  Ingin konsultasi?
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Hubungi kami melalui WhatsApp untuk konsultasi KPR.
                </p>
                <Link
                  href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20konsultasi%20terkait%20KPR%20properti%20ini."
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 w-full bg-[#DFF7F4] hover:bg-[#C8EFEA] text-[#006654] font-semibold py-2 rounded-lg border border-[#A9E3DD] transition-all shadow-sm"
                >
                  <MessageCircle size={18} className="text-[#006654]" />
                  Hubungi via WhatsApp
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// === KOMPONEN REUSABLE ===
const Card = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) => (
  <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-center gap-3 mb-5 border-b pb-3">
      <div className="text-bni-orange">{icon}</div>
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </motion.div>
);

const InfoItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number;
  icon?: ReactNode;
}) => (
  <div className="flex items-start gap-2">
    {icon && <div className="text-gray-600 mt-0.5">{icon}</div>}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      {value && <p className="font-semibold text-gray-800">{value}</p>}
    </div>
  </div>
);