// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();

//     // Simulasi user login
//     const userId = "USR123";
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     // Convert formData ke object
//     const profileData: Record<string, any> = {};
//     formData.forEach((v, k) => {
//       if (v instanceof File) profileData[k] = v.name;
//       else profileData[k] = v;
//     });

//     // Validasi
//     const numericFields = ["monthly_income", "postal_code", "company_postal_code"];
//     for (const field of numericFields) {
//       if (profileData[field] && isNaN(Number(profileData[field]))) {
//         return NextResponse.json({ error: `${field} harus angka` }, { status: 400 });
//       }
//     }

//     if (!profileData.full_name || !profileData.phone) {
//       return NextResponse.json({ error: "Nama dan No HP wajib diisi" }, { status: 400 });
//     }

//     // Simulasi simpan ke DB
//     console.log("✅ Data profil tersimpan:", profileData);

//     // Audit log
//     const log = {
//       user_id: userId,
//       action: "UPDATE_PROFILE",
//       timestamp: new Date().toISOString(),
//       ip: req.headers.get("x-forwarded-for") || "localhost",
//       changed_fields: Object.keys(profileData),
//     };
//     console.log("📝 Audit log:", log);

//     // Jika email berubah
//     if (profileData.email && profileData.email !== "user@email.com") {
//       console.log("📩 Email berubah — set is_verified=false dan kirim verifikasi ulang");
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Profil berhasil diperbarui!",
//       data: profileData,
//     });
//  Perfect 🙌 berikut **kode lengkap** versi final semua file yang kamu butuh untuk fitur **Update Profil User (Pembayaran KPR)** agar tidak bingung lagi.

// ---

// ## 🧩 **1️⃣ `src/app/user/akun/page.tsx`**

// > Halaman utama user (profil, notifikasi, pengajuan KPR, wishlist).  
// > Tab “Profil” sudah berisi form lengkap + integrasi API `/api/profile/update`.

// ```tsx
// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState, ReactNode } from "react";
// import Image from "next/image";
// import {
//   User as UserIcon,
//   Bell,
//   FileText,
//   Heart,
//   LogOut,
//   ChevronRight,
//   MapPin,
// } from "lucide-react";

// /* ==================== MAIN PAGE ==================== */
// type Section = "profil" | "notifikasi" | "pengajuan" | "wishlist";

// export default function AkunPage() {
//   const searchParams = useSearchParams();
//   const [active, setActive] = useState<Section>("profil");
//   const router = useRouter();

//   useEffect(() => {
//     const tab = (searchParams.get("tab") || "").toLowerCase();
//     if (["profil", "notifikasi", "pengajuan", "wishlist"].includes(tab)) {
//       setActive(tab as Section);
//     }
//   }, [searchParams]);

//   const goLogout = () => router.push("/");

//   return (
//     <main className="flex-1 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
//         {/* SIDEBAR */}
//         <aside className="md:col-span-4 lg:col-span-3">
//           <div className="rounded-2xl bg-white border shadow-sm overflow-hidden">
//             <SidebarItem active={active === "profil"} title="Profil" icon={<UserIcon className="h-5 w-5" />} onClick={() => setActive("profil")} />
//             <SidebarItem active={active === "notifikasi"} title="Notifikasi" icon={<Bell className="h-5 w-5" />} onClick={() => setActive("notifikasi")} />
//             <SidebarItem active={active === "pengajuan"} title="Pengajuan KPR" icon={<FileText className="h-5 w-5" />} onClick={() => setActive("pengajuan")} />
//             <SidebarItem active={active === "wishlist"} title="Wishlist" icon={<Heart className="h-5 w-5" />} onClick={() => setActive("wishlist")} />

//             <div className="h-px bg-gray-100 mx-4" />
//             <button
//               onClick={goLogout}
//               className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
//             >
//               <div className="flex items-center gap-3 text-gray-700">
//                 <LogOut className="h-5 w-5" />
//                 <span className="font-medium">Keluar</span>
//               </div>
//               <ChevronRight className="h-4 w-4 text-gray-400" />
//             </button>
//           </div>
//         </aside>

//         {/* CONTENT */}
//         <section className="md:col-span-8 lg:col-span-9">
//           <div className="rounded-2xl bg-white border shadow-sm p-6 space-y-12 min-h-[400px]">
//             {active === "profil" && <ProfilContent />}
//             {active === "notifikasi" && <NotifikasiContent />}
//             {active === "pengajuan" && <PengajuanContent />}
//             {active === "wishlist" && <WishlistContent />}
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// /* ==================== SIDEBAR ITEM ==================== */
// function SidebarItem({ title, icon, onClick, active }: { title: string; icon: ReactNode; onClick: () => void; active?: boolean }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center justify-between px-5 py-4 transition ${
//         active ? "bg-blue-50" : "hover:bg-gray-50"
//       }`}
//     >
//       <div className={`flex items-center gap-3 ${active ? "text-blue-600" : "text-gray-800"}`}>
//         <div className={`h-9 w-9 grid place-items-center rounded-xl ${active ? "bg-blue-100" : "bg-gray-100"}`}>
//           {icon}
//         </div>
//         <span className="font-semibold">{title}</span>
//       </div>
//       <ChevronRight className={`h-4 w-4 ${active ? "text-blue-600" : "text-gray-400"}`} />
//     </button>
//   );
// }

// /* ==================== CONTENT: PROFIL ==================== */
// function ProfilContent() {
//   const [formData, setFormData] = useState<any>({
//     full_name: "",
//     username: "",
//     email: "",
//     phone: "",
//     birth_date: "",
//     gender: "",
//     marital_status: "",
//     address: "",
//     occupation: "",
//     monthly_income: "",
//     profile_photo: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setFormData({
//       full_name: "Chipmunk Depok",
//       username: "chipmunk123",
//       email: "user@email.com",
//       phone: "081234567890",
//       gender: "Laki-laki",
//       marital_status: "Belum Menikah",
//       address: "Jl. Margonda Raya No. 10",
//       occupation: "Software Engineer",
//       monthly_income: "10000000",
//       profile_photo: null,
//     });
//   }, []);

//   const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleFileChange = (e: any) => {
//     const file = e.target.files?.[0];
//     if (file && file.size > 2 * 1024 * 1024) {
//       setError("Ukuran file melebihi 2MB");
//       return;
//     }
//     setFormData({ ...formData, profile_photo: file });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const fd = new FormData();
//       Object.entries(formData).forEach(([key, val]) => fd.append(key, val as any));

//       const res = await fetch("/api/profile/update", { method: "POST", body: fd });
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error);
//       setSuccess(data.message);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-6">Ubah Profil</h2>

//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* FOTO PROFIL */}
//         <div className="flex items-center gap-4">
//           <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 relative">
//             <Image
//               src={formData.profile_photo ? URL.createObjectURL(formData.profile_photo) : "/default-avatar.png"}
//               alt="Foto Profil"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600 mb-2 font-medium">Foto Profil (JPG/PNG ≤ 2MB)</label>
//             <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
//           </div>
//         </div>

//         {/* FORM FIELD */}
//         <div className="grid md:grid-cols-2 gap-4">
//           <Field name="full_name" label="Nama Lengkap" value={formData.full_name} onChange={handleChange} />
//           <Field name="username" label="Username" value={formData.username} onChange={handleChange} />
//           <Field name="email" label="Email" value={formData.email} onChange={handleChange} type="email" />
//           <Field name="phone" label="Nomor HP" value={formData.phone} onChange={handleChange} />
//           <Field name="birth_date" label="Tanggal Lahir" value={formData.birth_date} onChange={handleChange} type="date" />
//           <SelectField name="gender" label="Jenis Kelamin" value={formData.gender} onChange={handleChange} options={["Laki-laki", "Perempuan"]} />
//           <SelectField name="marital_status" label="Status Pernikahan" value={formData.marital_status} onChange={handleChange} options={["Belum Menikah", "Menikah", "Cerai"]} />
//           <Field name="address" label="Alamat" value={formData.address} onChange={handleChange} />
//           <Field name="occupation" label="Pekerjaan" value={formData.occupation} onChange={handleChange} />
//           <Field name="monthly_income" label="Penghasilan Bulanan (Rp)" value={formData.monthly_income} onChange={handleChange} type="number" />
//         </div>

//         {/* BUTTON */}
//         <div className="flex justify-end gap-4">
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           {success && <p className="text-green-600 text-sm">{success}</p>}
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400"
//           >
//             {loading ? "Menyimpan..." : "Simpan Perubahan"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// /* FIELD & SELECT COMPONENTS */
// function Field({ name, label, value, onChange, type = "text" }: any) {
//   return (
//     <label className="block">
//       <span className="text-sm text-gray-600 mb-1 block">{label}</span>
//       <input
//         name={name}
//         value={value}
//         type={type}
//         onChange={onChange}
//         className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
//       />
//     </label>
//   );
// }

// function SelectField({ name, label, value, onChange, options }: any) {
//   return (
//     <label className="block">
//       <span className="text-sm text-gray-600 mb-1 block">{label}</span>
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
//       >
//         <option value="">Pilih...</option>
//         {options.map((o: string) => (
//           <option key={o} value={o}>
//             {o}
//           </option>
//         ))}
//       </select>
//     </label>
//   );
// }

// /* TAB LAIN */
// function NotifikasiContent() {
//   return <p className="text-gray-500">Belum ada notifikasi.</p>;
// }
// function PengajuanContent() {
//   return <p className="text-gray-500">Belum ada pengajuan KPR.</p>;
// }
// function WishlistContent() {
//   return <p className="text-gray-500">Belum ada wishlist.</p>;
// }
