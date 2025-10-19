"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, ReactNode } from "react";
import Image from "next/image";
import {
  User as UserIcon,
  Bell,
  FileText,
  Heart,
  LogOut,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  Home,
} from "lucide-react";

/* ==================== TYPES & CONSTANTS ==================== */
type Section = "profil" | "notifikasi" | "pengajuan" | "wishlist";
type AppStatus = "Menunggu Verifikasi" | "Verifikasi Dokumen" | "Analisa Kredit" | "Disetujui" | "Ditolak" | "Akad";
type Application = {
  id: number;
  cluster: string;
  city: string;
  status: AppStatus;
  loanAmount: number;
  date: string;
  image: string;
};
const COLORS = { teal: "#3FD8D4", gray: "#757575", orange: "#FF8500", lime: "#DDEE59", blue: "#C5F3F3" };

/* ==================== MAIN COMPONENT ==================== */
export default function AkunPage() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<Section>("profil");
  const router = useRouter();

  useEffect(() => {
    const tab = (searchParams.get("tab") || "").toLowerCase();
    if (["profil", "notifikasi", "pengajuan", "wishlist"].includes(tab)) {
      setActive(tab as Section);
    }
  }, [searchParams]);

  const goLogout = () => router.push("/");

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
        {/* SIDEBAR */}
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="rounded-2xl bg-white border shadow-sm overflow-hidden">
            <SidebarItem active={active === "profil"} title="Profil" icon={<UserIcon className="h-5 w-5" />} onClick={() => setActive("profil")} />
            <SidebarItem active={active === "notifikasi"} title="Notifikasi" icon={<Bell className="h-5 w-5" />} onClick={() => setActive("notifikasi")} />
            <SidebarItem active={active === "pengajuan"} title="Pengajuan KPR" icon={<FileText className="h-5 w-5" />} onClick={() => setActive("pengajuan")} />
            <SidebarItem active={active === "wishlist"} title="Wishlist" icon={<Heart className="h-5 w-5" />} onClick={() => setActive("wishlist")} />
            <div className="h-px bg-gray-100 mx-4" />
            <button
              onClick={goLogout}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 text-gray-700">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Keluar</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="md:col-span-8 lg:col-span-9">
          <div className="rounded-2xl bg-white border shadow-sm p-6 space-y-12 min-h-[400px]">
            {active === "profil" && <ProfilContent />}
            {active === "notifikasi" && <NotifikasiContent />}
            {active === "pengajuan" && <PengajuanKPRContent />}
            {active === "wishlist" && <WishlistContent />}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ==================== SIDEBAR ITEM ==================== */
function SidebarItem({ title, icon, onClick, active }: { title: string; icon: ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-4 transition ${
        active ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <div className={`flex items-center gap-3 ${active ? "text-blue-600" : "text-gray-800"}`}>
        <div className={`h-9 w-9 grid place-items-center rounded-xl ${active ? "bg-blue-100" : "bg-gray-100"}`}>
          {icon}
        </div>
        <span className="font-semibold">{title}</span>
      </div>
      <ChevronRight className={`h-4 w-4 ${active ? "text-blue-600" : "text-gray-400"}`} />
    </button>
  );
}

/* ==================== PROFIL CONTENT (FORM UPDATE) ==================== */
/* ==================== PROFIL CONTENT (FULLY EXPANDED) ==================== */
function ProfilContent() {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    nik: "",
    npwp: "",
    birth_date: "",
    birth_place: "",
    gender: "",
    marital_status: "",
    address: "",
    sub_district: "",
    district: "",
    city: "",
    province: "",
    postal_code: "",
    occupation: "",
    company_name: "",
    company_address: "",
    company_district: "",
    company_subdistrict: "",
    company_city: "",
    company_province: "",
    company_postal_code: "",
    monthly_income: "",
    profile_photo: null as File | null,
    ktp_photo: null as File | null,
    salary_slip_photo: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulasi fetch data profil dari DB
    setFormData({
      ...formData,
      full_name: "Chipmunk Depok",
      username: "chipmunk123",
      email: "user@email.com",
      phone: "081234567890",
      nik: "3175010202000001",
      npwp: "09.888.999.0-123.000",
      birth_date: "1998-06-01",
      birth_place: "Depok",
      gender: "Laki-laki",
      marital_status: "Belum Menikah",
      address: "Jl. Melati No. 10",
      sub_district: "Kemiri",
      district: "Beji",
      city: "Depok",
      province: "Jawa Barat",
      postal_code: "16422",
      occupation: "Software Engineer",
      company_name: "PT Satu Atap Digital",
      company_address: "Jl. Sudirman No. 1",
      company_district: "Setiabudi",
      company_subdistrict: "Kuningan",
      company_city: "Jakarta Selatan",
      company_province: "DKI Jakarta",
      company_postal_code: "12950",
      monthly_income: "15000000",
    });
  }, []);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;

    if (file && file.size > 2 * 1024 * 1024) {
      setError(`Ukuran file ${name} melebihi 2MB`);
      e.target.value = "";
      return;
    }

    const allowed = ["image/jpeg", "image/png"];
    if (file && !allowed.includes(file.type)) {
      setError(`Format ${name} harus JPG atau PNG`);
      e.target.value = "";
      return;
    }

    setError("");
    setFormData({ ...formData, [name]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([k, v]) => form.append(k, v as any));

      const res = await fetch("/api/profile/update", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal update profil");
      setSuccess(data.message || "Profil berhasil diperbarui");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Ubah Profil</h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* === FOTO PROFIL === */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-4">Foto Profil</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 relative">
              <Image
                src={formData.profile_photo ? URL.createObjectURL(formData.profile_photo) : "/default-avatar.png"}
                alt="Foto Profil"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="block text-sm text-gray-600 font-medium mb-2">
                Upload JPG/PNG ≤ 2MB
              </span>
              <label className="flex items-center justify-center w-40 px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded-xl cursor-pointer hover:bg-gray-300 transition">
                📎 Pilih File
                <input
                  type="file"
                  name="profile_photo"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

          </div>
        </section>

        {/* === INFORMASI PRIBADI === */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-4">Informasi Pribadi</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field name="full_name" label="Nama Lengkap" value={formData.full_name} onChange={handleChange} />
            <Field name="username" label="Username" value={formData.username} onChange={handleChange} />
            <Field name="email" label="Email" value={formData.email} onChange={handleChange} type="email" />
            <Field name="phone" label="Nomor HP" value={formData.phone} onChange={handleChange} />
            <Field name="nik" label="NIK" value={formData.nik} onChange={handleChange} />
            <Field name="npwp" label="NPWP" value={formData.npwp} onChange={handleChange} />
            <Field name="birth_place" label="Tempat Lahir" value={formData.birth_place} onChange={handleChange} />
            <Field name="birth_date" label="Tanggal Lahir" value={formData.birth_date} onChange={handleChange} type="date" />
            <SelectField name="gender" label="Jenis Kelamin" value={formData.gender} onChange={handleChange} options={["Laki-laki", "Perempuan"]} />
            <SelectField name="marital_status" label="Status Pernikahan" value={formData.marital_status} onChange={handleChange} options={["Belum Menikah", "Menikah", "Cerai"]} />
          </div>
        </section>

        {/* === ALAMAT DOMISILI === */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-4">Alamat Domisili</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field name="address" label="Alamat Lengkap" value={formData.address} onChange={handleChange} />
            <Field name="sub_district" label="Kelurahan" value={formData.sub_district} onChange={handleChange} />
            <Field name="district" label="Kecamatan" value={formData.district} onChange={handleChange} />
            <Field name="city" label="Kota / Kabupaten" value={formData.city} onChange={handleChange} />
            <Field name="province" label="Provinsi" value={formData.province} onChange={handleChange} />
            <Field name="postal_code" label="Kode Pos" value={formData.postal_code} onChange={handleChange} />
          </div>
        </section>

        {/* === DATA PEKERJAAN === */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-4">Data Pekerjaan</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field name="occupation" label="Pekerjaan" value={formData.occupation} onChange={handleChange} />
            <Field name="monthly_income" label="Penghasilan Bulanan (Rp)" value={formData.monthly_income} onChange={handleChange} type="number" />
            <Field name="company_name" label="Nama Perusahaan" value={formData.company_name} onChange={handleChange} />
            <Field name="company_address" label="Alamat Kantor" value={formData.company_address} onChange={handleChange} />
            <Field name="company_subdistrict" label="Kelurahan Kantor" value={formData.company_subdistrict} onChange={handleChange} />
            <Field name="company_district" label="Kecamatan Kantor" value={formData.company_district} onChange={handleChange} />
            <Field name="company_city" label="Kota Kantor" value={formData.company_city} onChange={handleChange} />
            <Field name="company_province" label="Provinsi Kantor" value={formData.company_province} onChange={handleChange} />
            <Field name="company_postal_code" label="Kode Pos Kantor" value={formData.company_postal_code} onChange={handleChange} />
          </div>
        </section>

        {/* === FOTO DOKUMEN === */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-4">Dokumen Pendukung</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FileUpload name="ktp_photo" label="Foto KTP (JPG/PNG ≤ 2MB)" onChange={handleFileChange} />
            <FileUpload name="salary_slip_photo" label="Foto Slip Gaji (JPG/PNG ≤ 2MB)" onChange={handleFileChange} />
          </div>
        </section>

        <div className="flex items-center justify-end gap-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-[#FF8500] text-white font-semibold hover:bg-[#e67800] disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

      </form>
    </div>
  );
}

/* === Subcomponent === */
function Field({ name, label, value, onChange, type = "text" }: any) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-500 mb-1">{label}</span>
      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function SelectField({ name, label, value, onChange, options }: any) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-500 mb-1">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Pilih...</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function FileUpload({ name, label, onChange }: any) {
  return (
    <div className="space-y-2">
      <span className="block text-sm text-gray-500 font-medium">{label}</span>
      <label className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded-xl cursor-pointer hover:bg-gray-300 transition">
        📎 Pilih File
        <input
          type="file"
          name={name}
          accept=".jpg,.jpeg,.png"
          onChange={onChange}
          className="hidden"
        />
      </label>
    </div>
  );
}



/* ==================== PENGAJUAN KPR / DASHBOARD ==================== */
function PengajuanKPRContent() {
   const router = useRouter();
  const [applications] = useState<Application[]>([
    { id: 1, cluster: "Cluster Green Valley", city: "Serpong, Banten", status: "Disetujui", loanAmount: 1500000000, date: "15 Juli 2025", image: "/rumah-1.jpg" },
    { id: 2, cluster: "Rumah Klasik Menteng", city: "Jakarta Pusat", status: "Analisa Kredit", loanAmount: 25000000000, date: "18 Juli 2025", image: "/rumah-2.jpg" },
  ]);

  const goToDetail = (id: number) => {
    router.push(`/user/detail-pengajuan?loanId=${id}`);
  };

  if (applications.length === 0)
    return <p className="text-gray-500 text-center py-10">Belum ada pengajuan aktif.</p>;

  const totalApps = applications.length;
  const totalLoan = useMemo(() => applications.reduce((s, a) => s + a.loanAmount, 0), [applications]);
  const formatIDR = (n: number) => n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

  const statusStyle = (status: AppStatus) =>
    ({
      Disetujui: { chip: "text-green-700 border-green-600", dot: "bg-green-600" },
      "Analisa Kredit": { chip: "text-orange-700 border-orange-600", dot: "bg-orange-500" },
      "Verifikasi Dokumen": { chip: "text-blue-700 border-blue-600", dot: "bg-blue-600" },
      "Menunggu Verifikasi": { chip: "text-gray-700 border-gray-500", dot: "bg-gray-500" },
      Ditolak: { chip: "text-red-700 border-red-600", dot: "bg-red-600" },
      Akad: { chip: "text-indigo-700 border-indigo-600", dot: "bg-indigo-600" },
    }[status]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Monitoring Progress KPR</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SummaryCard icon={<FileText size={24} />} title="Total Aplikasi" value={String(totalApps)} accent="#3FD8D4" />
        <SummaryCard icon={<CheckCircle2 size={24} />} title="Disetujui" value={String(applications.filter(a => a.status === "Disetujui").length)} accent="#16a34a" />
        <SummaryCard icon={<RefreshCcw size={24} />} title="Total Pinjaman" value={formatIDR(totalLoan)} accent="#4f46e5" isMoney />
      </div>

      <div className="flex flex-col gap-6">
        {applications.map(app => {
          const s = statusStyle(app.status);
          return (
            <div key={app.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all">
              <div className="grid md:grid-cols-[280px_1fr]">
                <div className="relative h-48 md:h-full">
                  <Image src={app.image} alt={app.cluster} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{app.cluster}</h3>
                      <p className="flex items-center text-gray-600 mt-1 text-sm">
                        <MapPin size={14} className="mr-1" /> {app.city}
                      </p>
                    </div>
                    <span className={`flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm font-semibold border ${s.chip}`}>
                      <span className={`inline-block w-2 h-2 rounded-full ${s.dot}`} />
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <InfoItem label="Nomor Aplikasi" value={`KPR-${app.id.toString().padStart(4, "0")}`} />
                    <InfoItem label="Jumlah Pinjaman" value={formatIDR(app.loanAmount)} />
                    <InfoItem label="Tanggal Update" value={app.date} />
                  </div>

                                  <div className="flex items-center justify-end">
                  <button
                    onClick={() => goToDetail(app.id)}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-transform hover:scale-105"
                    style={{ background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.lime})` }}
                  >
                    Lihat Detail
                  </button>
                </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==================== WISHLIST ==================== */
function WishlistContent() {
  const [wishlist, setWishlist] = useState<any[]>([
    { id: 1, name: "Cluster Green Valley", location: "Serpong, Banten", price: "Rp 1.500.000.000", image: "/rumah-1.jpg" },
  ]);
  const toggleWishlist = (id: number) => setWishlist(prev => prev.filter(item => item.id !== id));

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-500 text-sm">Belum ada rumah di wishlist kamu.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map(house => (
            <div key={house.id} className="relative rounded-xl border p-4 hover:shadow-md transition bg-white">
              <button
                onClick={() => toggleWishlist(house.id)}
                className="absolute top-2 right-2 z-20 p-1 bg-white/80 backdrop-blur rounded-full hover:bg-white"
              >
                <Heart className="w-5 h-5 fill-red-500 stroke-red-500 hover:scale-110 transition" />
              </button>
              <div className="h-32 bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                <Image src={house.image} alt={house.name} fill className="object-cover rounded-lg z-10" />
              </div>
              <p className="font-semibold text-gray-800 truncate">{house.name}</p>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin size={14} className="mr-1" /> {house.location}
              </p>
              <p className="text-sm text-orange-600 font-bold mt-1">{house.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 
function SummaryCard({ icon, title, value, accent, isMoney = false }: { icon: ReactNode; title: string; value: string; accent: string; isMoney?: boolean }) {
  return (
    <div className="rounded-2xl p-5 bg-white/80 border border-white shadow-sm hover:shadow-md transition" style={{ boxShadow: `0 6px 16px -6px ${accent}55` }}>
      <div className="flex items-start justify-between">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white shadow" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>{icon}</div>
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`mt-1 font-extrabold tracking-tight ${isMoney ? "text-xl" : "text-2xl"}`}>{value}</p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function NotifikasiContent() {
  return <p className="text-gray-500">Belum ada notifikasi.</p>;
}
