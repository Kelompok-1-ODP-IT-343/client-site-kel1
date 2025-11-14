import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Home,
  CreditCard,
  FileText,
  BadgeInfo,
  Landmark,
  Compass,
  MessageCircle,
  Building,
} from "lucide-react";
import { fetchPropertyDetail } from "@/app/lib/coreApi";
import type { PropertyDetail } from "@/app/lib/types";
import PropertyGallery from "@/app/components/PropertyGallery";

export const fmtIDR = (v: unknown): string => {
  const raw = typeof v === "string" ? v.replace(/[^0-9.-]/g, "") : v;
  const n = Number(raw);
  if (!Number.isFinite(n)) return "-";
  const num = new Intl.NumberFormat("id-ID").format(Math.trunc(n));
  return `Rp ${num}`;
};

const fmtNum = (v: unknown) =>
  v !== null && v !== undefined && String(v).trim() !== "" ? String(v) : "-";

async function getDetail(id: number): Promise<PropertyDetail | null> {
  try {
    return await fetchPropertyDetail(id);
  } catch (e) {
    console.error("Gagal fetch detail:", e);
    return null;
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const detail = await getDetail(id);

  if (!detail) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[300px]">
        {" "}
        <h1 className="text-2xl font-bold">Properti tidak ditemukan.</h1>{" "}
        <p className="text-gray-600">Gagal memuat data dari server.</p>{" "}
      </main>
    );
  }

  const formattedPrice = fmtIDR(detail.price);

  const targetAjukanParams = new URLSearchParams({
    propertiId: String(detail.id),
    propertiNama: detail.title,
    propertiLokasi: detail.city || "",
    hargaProperti: String(detail.price),
  }).toString();

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        {" "}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          {" "}
          <Link href="/user/cari-rumah" className="hover:underline">
            Cari Rumah{" "}
          </Link>
          <ChevronRight size={16} className="mx-1" />{" "}
          <span className="font-semibold text-gray-700">Detail Rumah</span>{" "}
        </div>{" "}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          {detail.title}
        </h1>{" "}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-gray-600">
          <p className="flex items-center gap-1.5">
            <MapPin size={16} /> {detail.city || "-"}
          </p>
          {detail.developer && (
            <p className="flex items-center gap-1.5">
              <Building size={16} /> Dibangun oleh:
              <span className="font-semibold text-gray-700">
                {detail.developer.companyName}
              </span>
            </p>
          )}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card title="Galeri Properti" icon={<Home />}>
            <PropertyGallery images={detail.images} title={detail.title} />
          </Card>
          <Card title="Deskripsi & Spesifikasi" icon={<FileText />}>
            {" "}
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Deskripsi
            </h3>{" "}
            <p className="mb-6 text-gray-600 prose prose-sm max-w-none">
              {fmtNum(detail.description)}
            </p>{" "}
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Detail Properti
            </h3>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <DetailTile
                icon={<Home className="w-5 h-5" />}
                label="Tipe Properti"
                value={fmtNum(detail.property_type)}
              />
              <DetailTile
                icon={<FileText className="w-5 h-5" />}
                label="Kadar sertifikat"
                value={fmtNum(detail.property_code)}
              />
              <DetailTile
                icon={<Building className="w-5 h-5" />}
                label="Tipe Developer"
                value={String((detail.listing_type || "").toUpperCase() === "PRIMARY" ? "Pilihan" : "Kerja Sama")}
              />
              <DetailTile
                icon={<Landmark className="w-5 h-5" />}
                label="Kota"
                value={fmtNum(detail.city)}
              />
            </div>{" "}
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Fitur & Spesifikasi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm mb-6">
              {" "}
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
                <p className="text-gray-500">- Fitur tidak tersedia -</p>
              )}{" "}
            </div>{" "}
          </Card>{" "}

          {/* Lokasi dan Tempat Sekitar */}
          <Card title="Lokasi dan Tempat Sekitar" icon={<Compass />}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Lihat Lokasi di Peta
            </h3>
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-gray-100 mb-6">
              {/* Gunakan koordinat jika tersedia, jika tidak gunakan pencarian berdasarkan judul/kota */}
              {(() => {
                const hasCoords =
                  typeof detail.latitude === "number" &&
                  typeof detail.longitude === "number" &&
                  Number.isFinite(detail.latitude) &&
                  Number.isFinite(detail.longitude);
                const q = hasCoords
                  ? `${detail.latitude},${detail.longitude}`
                  : `${detail.title} ${detail.city ?? ""}`;
                const url = `https://www.google.com/maps?q=${encodeURIComponent(
                  q
                )}&hl=id&z=${hasCoords ? 15 : 12}&output=embed`;
                return (
                  <iframe
                    src={url}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                );
              })()}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Tempat Terdekat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {detail.locations.length > 0 ? (
                detail.locations.map((l, idx) => (
                  <InfoItem
                    key={idx}
                    label={l.poiName}
                    value={`${fmtNum(l.distanceKm)} km`}
                    icon={<Compass size={16} />}
                  />
                ))
              ) : (
                <p className="text-gray-500">- Tidak ada data lokasi terdekat -</p>
              )}
            </div>
          </Card>{" "}
        </div>
        <div className="flex flex-col gap-8">
          {" "}
          <div className="sticky top-24">
            {" "}
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

              <Link
                href={`/user/pengajuan?${targetAjukanParams}`}
                className="mt-4 w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-all block text-center"
              >
                Ajukan KPR Sekarang
              </Link>

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
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
}
function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {" "}
      <div className="flex items-center gap-3 mb-5 border-b pb-3">
        <div className="p-2 bg-orange-50 rounded-lg text-orange-500">{icon}</div>{" "}
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>{" "}
      </div>
      {children}{" "}
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
      {icon && <div className="text-orange-500">{icon}</div>}{" "}
      <div className="flex-1">
        <p className="text-xs text-gray-600">{label}</p>{" "}
        <p className="font-semibold text-gray-800">{value ?? "-"}</p>{" "}
      </div>{" "}
    </div>
  );
}

function DetailTile({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string | number;
}) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="font-semibold text-gray-900">{value ?? "-"}</p>
        </div>
      </div>
    </div>
  );
}
