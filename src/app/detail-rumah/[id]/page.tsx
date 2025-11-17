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
  Calendar,
  Hash,
  Ruler,
  BedDouble,
  Bath,
  Car,
  Receipt,
  ShieldCheck,
  Eye,
  Heart,
  MessageSquare,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import FeatureList from "@/app/components/FeatureList";
import { fetchPropertyDetail } from "@/app/lib/coreApi";
import type { PropertyDetail } from "@/app/lib/types";
import PropertyGallery from "@/app/components/PropertyGallery";
// Removed modal-based DeveloperDetails in favor of inline compact rows

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
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
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
  const fullAddress = [
    detail.address,
    [detail.subdistrict, detail.district].filter(Boolean).join(", ") || null,
    [detail.city, detail.province].filter(Boolean).join(", ") || null,
    detail.postalCode ? `Kode Pos ${detail.postalCode}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const targetAjukanParams = new URLSearchParams({
    propertiId: String(detail.id),
    propertiNama: detail.title,
    propertiLokasi: detail.city || "",
    hargaProperti: String(detail.price),
  }).toString();

  // Filter out Carport from features & specifications
  const featuresNoCarport = Array.isArray(detail.features)
    ? detail.features.filter(
        (f) => !String(f?.featureName || "").toLowerCase().includes("carport")
      )
    : [];

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
          <div className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <DevRow label="Alamat" value={detail.address} icon={<MapPin className="w-4 h-4 text-orange-500" />} />
                <DevRow label="Kelurahan/Desa" value={detail.subdistrict} icon={<FileText className="w-4 h-4 text-orange-500" />} />
                <DevRow label="Kecamatan" value={detail.district} icon={<FileText className="w-4 h-4 text-orange-500" />} />
              </div>
              <div className="space-y-2">
                <DevRow label="Kota/Kabupaten" value={detail.city} icon={<FileText className="w-4 h-4 text-orange-500" />} />
                <DevRow label="Provinsi" value={detail.province} icon={<FileText className="w-4 h-4 text-orange-500" />} />
              </div>
            </div>
          </div>
          {/* Keterangan Properti */}
          <Card title="Keterangan Properti" icon={<FileText />}>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Deskripsi</h3>
            <p className="mb-6 text-gray-600 whitespace-pre-line">
              {fmtNum(detail.description)}
            </p>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Detail Umum</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <DetailTile icon={<Home className="w-5 h-5" />} label="Tipe Properti" value={fmtNum(detail.property_type)} />
              <DetailTile icon={<Landmark className="w-5 h-5" />} label="Kota" value={fmtNum(detail.city)} />
              <DetailTile icon={<Hash className="w-5 h-5" />} label="Kode Properti" value={fmtNum(detail.property_code)} />
              <DetailTile icon={<Calendar className="w-5 h-5" />} label="Tahun Dibangun" value={detail.yearBuilt ?? "-"} />
              <DetailTile icon={<Calendar className="w-5 h-5" />} label="Serah Terima" value={fmtNum(detail.handoverDate)} />
              <DetailTile icon={<Calendar className="w-5 h-5" />} label="Ketersediaan" value={fmtNum(detail.availabilityDate)} />
            </div>
          </Card>

          {/* Spesifikasi Teknis */}
          <Card title="Fitur Rumah" icon={<Ruler />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Kamar Tidur" value={detail.bedrooms ?? "-"} icon={<BedDouble className="w-5 h-5" />} />
              <InfoItem label="Harga per m²" value={detail.pricePerSqm ? fmtIDR(detail.pricePerSqm) : "-"} icon={<Receipt className="w-5 h-5" />} />
              <InfoItem label="Jumlah Lantai" value={detail.floors ?? "-"} icon={<Ruler className="w-5 h-5" />} />
              <InfoItem label="Luas Tanah" value={detail.landArea ? `${detail.landArea} m²` : "-"} icon={<Home className="w-5 h-5" />} />
              <InfoItem label="Kamar Mandi" value={detail.bathrooms ?? "-"} icon={<Bath className="w-5 h-5" />} />
              <InfoItem label="Luas Bangunan" value={detail.buildingArea ? `${detail.buildingArea} m²` : "-"} icon={<Home className="w-5 h-5" />} />

              <InfoItem label="Garasi/Carport" value={detail.garage ?? "-"} icon={<Car className="w-5 h-5" />} />
            </div>
          </Card>

          {/* Legalitas & Pajak */}
          <Card title="Legalitas & Pajak" icon={<ShieldCheck />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Jenis Sertifikat" value={fmtNum(detail.certificate_type)} icon={<ShieldCheck className="w-5 h-5" />} />
              <InfoItem label="Luas Sertifikat" value={detail.certificateArea ? `${detail.certificateArea} m²` : "-"} icon={<Ruler className="w-5 h-5" />} />
              <InfoItem label="PBB (per tahun)" value={detail.pbb_value ? fmtIDR(detail.pbb_value) : "-"} icon={<Receipt className="w-5 h-5" />} />
              <InfoItem label="Biaya Pemeliharaan" value={detail.maintenanceFee != null ? fmtIDR(detail.maintenanceFee) : "-"} icon={<Receipt className="w-5 h-5" />} />

            </div>
          </Card>

          {/* Lokasi dan Tempat Sekitar */}
          <Card title="Lokasi & Sekitar" icon={<Compass />}>
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
                const url = `https://www.google.com/maps?q=${encodeURIComponent(q)}&hl=id&z=${hasCoords ? 15 : 12}&output=embed`;
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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

          {/* Developer */}
          {detail.developer && (
            <Card title="Developer" icon={<Building />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <DevRow label="Nama Perusahaan" value={detail.developer.companyName} icon={<Building className="w-4 h-4 text-orange-500" />} />
                  <DevRow label="Kemitraan" value={formatPartnership(detail.developer.partnershipLevel)} icon={<FileText className="w-4 h-4 text-orange-500" />} />
                  <DevRow label="Contact Person" value={detail.developer.contactPerson} icon={<FileText className="w-4 h-4 text-orange-500" />} />
                  <DevRow label="Telepon" value={detail.developer.phone} icon={<Phone className="w-4 h-4 text-orange-500" />} href={detail.developer.phone ? `tel:${detail.developer.phone}` : undefined} />
                </div>
                <div className="space-y-2">
                  <DevRow label="Email" value={detail.developer.email} icon={<Mail className="w-4 h-4 text-orange-500" />} href={detail.developer.email ? `mailto:${detail.developer.email}` : undefined} />
                  <DevRow label="Website" value={detail.developer.website} icon={<Globe className="w-4 h-4 text-orange-500" />} href={detail.developer.website ? (detail.developer.website.startsWith("http") ? detail.developer.website : `https://${detail.developer.website}`) : undefined} external />
                  <DevRow
                          label="Alamat"
                          value={`${detail.developer.address}, ${detail.developer.city}, ${detail.developer.province}`}
                          icon={<MapPin className="w-4 h-4 text-orange-500" />}
                  />

                </div>
              </div>
            </Card>
          )}
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
            {/* KPR & Simulasi */}
            <Card title="KPR & Simulasi" icon={<CreditCard />}>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <InfoItem label="Tipe Listing" value={fmtNum(detail.listing_type)} icon={<FileText className="w-5 h-5" />} />
                <InfoItem label="Tipe Properti" value={fmtNum(detail.property_type)} icon={<Home className="w-5 h-5" />} />
                <InfoItem label="Uang Muka Minimum" value={detail.minDownPaymentPercent != null ? `${detail.minDownPaymentPercent}%` : "-"} icon={<Receipt className="w-5 h-5" />} />
                <InfoItem label="Tenor Maksimum" value={detail.maxLoanTermYears != null ? `${detail.maxLoanTermYears} tahun` : "-"} icon={<Calendar className="w-5 h-5" />} />
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

function formatPartnership(raw?: string | null): string {
  if (!raw) return "-";
  // Replace underscores/spaces, Title Case each word
  return String(raw)
    .toLowerCase()
    .split(/[ _]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
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
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="font-semibold text-gray-900">{value ?? "-"}</p>
        </div>
      </div>
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

function DevRow({
  label,
  value,
  icon,
  href,
  external,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
  href?: string;
  external?: boolean;
}) {
  const display = value && String(value).trim().length > 0 ? String(value) : "-";
  const content = href && display !== "-" ? (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-gray-800 font-semibold hover:text-bni-orange break-words"
    >
      {display}
    </a>
  ) : (
    <span className="text-gray-800 font-semibold break-words">{display}</span>
  );
  return (
    <div className="flex items-start gap-2 py-1">
      {icon && <span className="mt-0.5">{icon}</span>}
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <div className="flex-1 min-w-0">{content}</div>
    </div>
  );
}
