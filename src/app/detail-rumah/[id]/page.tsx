"use client";

import { ReactNode, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { fetchPropertyDetail } from "@/app/lib/coreApi";
import type { PropertyDetail } from "@/app/lib/types";

const fmtNum = (v: unknown) =>
  v !== null && v !== undefined && String(v).trim() !== "" ? String(v) : "-";
export const fmtIDR = (v: unknown, withSpace: boolean = true): string => {
  const raw = typeof v === "string" ? v.replace(/[^0-9.-]/g, "") : v;
  const n = Number(raw);
  if (!Number.isFinite(n)) return "-";
  const num = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(Math.trunc(n));
  return withSpace ? `Rp ${num}` : `Rp${num}`;
};
const fmtArea = (v: unknown) =>
  v !== null && v !== undefined && String(v).trim() !== "" ? `${v} m²` : "-";

export default function PropertyDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();

  const id = Number(params.id);

  const detail = use(getDetail(id));

  if (!detail) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Properti tidak ditemukan.</h1>
      </main>
    );
  }

  const formattedPrice = fmtIDR(detail.price);

  const handleAjukanKPR = () => {
    const urlParams = new URLSearchParams({
      propertiId: String(detail.id),
      propertiNama: detail.title,
      propertiLokasi: detail.city || "",
      hargaProperti: String(detail.price),
    });
    const target = `/user/pengajuan?${urlParams.toString()}`;
    router.push(target);
  };

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/user/cari-rumah" className="hover:underline">
            Cari Rumah
          </Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="font-semibold text-gray-700">Detail Rumah</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          {detail.title}
        </h1>
        <p className="mt-1 text-gray-600 flex items-center gap-1.5">
          <MapPin size={16} /> {detail.city || "-"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card title="Galeri Properti" icon={<Home />}>
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
              <Image
                src={(detail.images && detail.images[0]) || "/placeholder.png"}
                alt={detail.title}
                fill
                className="object-cover"
              />
            </div>
            {detail.images && detail.images.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {detail.images.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-28 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`img-${idx}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Deskripsi & Spesifikasi" icon={<FileText />}>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Deskripsi</h3>
            <p className="mb-6 text-gray-600">{fmtNum(detail.description)}</p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Detail Properti
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm mb-6">
              <InfoItem
                label="Tipe Properti"
                value={fmtNum(detail.property_type)}
                icon={<BadgeInfo size={16} />}
              />
              <InfoItem
                label="Kode"
                value={fmtNum(detail.property_code)}
                icon={<FileText size={16} />}
              />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">Lokasi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm mb-6">
              <InfoItem
                label="Kota"
                value={fmtNum(detail.city)}
                icon={<Landmark size={16} />}
              />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">Fitur</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm mb-6">
              {detail.features.length > 0 ? (
                detail.features.map((f, idx) => (
                  <InfoItem
                    key={idx}
                    label={f.featureName}
                    value={f.featureValue}
                    icon={<BadgeInfo size={16} />}
                  />
                ))
              ) : (
                <p className="text-gray-500">-</p>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Lokasi Terdekat
            </h3>
            <div className="grid grid-cols-1 gap-y-2 text-sm mb-6">
              {detail.locations.length > 0 ? (
                detail.locations.map((l, idx) => (
                  <InfoItem
                    key={idx}
                    label={l.poiName}
                    value={`${l.distanceKm} km`}
                    icon={<Compass size={16} />}
                  />
                ))
              ) : (
                <p className="text-gray-500">-</p>
              )}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-8">
          <div className="sticky top-24">
            <Card title="Harga Properti" icon={<CreditCard />}>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-bni-orange">
                  {formattedPrice}
                </p>
              </div>
            </Card>

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

async function getDetail(id: number): Promise<PropertyDetail | null> {
  try {
    return await fetchPropertyDetail(id);
  } catch {
    return null;
  }
}

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
