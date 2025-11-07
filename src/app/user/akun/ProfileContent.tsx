"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Field from "@/app/user/akun/Field";
import SelectField from "@/app/user/akun/SelectField";
import FileUpload from "@/app/user/akun/FileUpload";
import { useAuth } from "@/app/lib/authContext";
import { updateUserProfile } from "@/app/lib/coreApi";

import { getCookie } from "@/app/lib/cookie";
import { API_BASE_URL } from "@/app/lib/apiConfig";
import rawData from "@/data/indonesia.json";

import {
  ALLOWED_TYPES,
  DEFAULT_PROFILE,
  MAX_FILE_SIZE,
} from "@/app/user/akun/constants";
import { ProfileForm } from "@/app/user/akun/types";

export default function ProfilContent() {
  const [formData, setFormData] = useState<ProfileForm>({ ...DEFAULT_PROFILE });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);
  const indonesiaData = rawData as {
  province: string;
  city: string;
  sub_district: string;
  postalcode: string;
  }[];
  const [provinsiList, setProvinsiList] = useState<string[]>([]);
  const [kotaList, setKotaList] = useState<string[]>([]);
  const [kecamatanList, setKecamatanList] = useState<string[]>([]);
  const [kodePosList, setKodePosList] = useState<string[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        if (!user?.id) return;

        const token = getCookie("token");
        const tokenType = getCookie("token_type") || "Bearer";

        const res = await fetch(`${API_BASE_URL}/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${token}`,
          },
        });

        const json = await res.json();
        console.log("Response Profil:", json); 
        console.log("==== FETCH USER PROFILE RESPONSE ====");
        console.log("URL:", `${API_BASE_URL}/user/${user.id}`);
        console.log("TOKEN:", getCookie("token"));
        console.log("USER ID:", user.id);
        console.log("RESPONSE JSON:", json);

        if (res.ok && json.success && json.data) {
          const d = json.data;

          setFormData((prev) => ({
            ...prev,
            full_name: d.fullName || "",
            username: d.username || "",
            email: d.email || "",
            phone: d.phone || "",
            nik: d.nik || "",
            npwp: d.npwp || "",
            birth_date: d.birthDate || "",
            birth_place: d.birthPlace || "",
            gender: d.gender === "FEMALE" ? "Perempuan" : "Laki-laki",
            marital_status:
              d.maritalStatus === "SINGLE"
                ? "Belum Menikah"
                : d.maritalStatus === "MARRIED"
                ? "Menikah"
                : "Cerai",
            address: d.address || "",
            city: d.city || "",
            province: d.province || "",
            postal_code: d.postalCode || "",
            occupation: d.occupation || "",
            company_name: d.companyName || "",
            monthly_income: String(d.monthlyIncome || ""),
          }));
        } else {
          console.warn("Gagal ambil data profil:", json.message);
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      }
    }

    fetchUserProfile();
  }, [user]);

  // === Inisialisasi data wilayah ===
  useEffect(() => {
    const provinces = [...new Set(indonesiaData.map((d) => d.province))];
    setProvinsiList(provinces);
  }, []);

  useEffect(() => {
    if (!formData.province) return;
    const cities = indonesiaData
      .filter((d) => d.province === formData.province)
      .map((d) => d.city);
    setKotaList([...new Set(cities)]);
    setKecamatanList([]);
    setKodePosList([]);
  }, [formData.province]);

  useEffect(() => {
    if (!formData.city) return;
    const districts = indonesiaData
      .filter((d) => d.city === formData.city)
      .map((d) => d.sub_district);
    setKecamatanList([...new Set(districts)]);
    setKodePosList([]);
  }, [formData.city]);

useEffect(() => {
  if (!formData.sub_district) return;
  const postal = indonesiaData
    .filter((d) => d.sub_district === formData.sub_district)
    .map((d) => d.postalcode);

  const kodePos = postal.length > 0 ? postal[0] : "";
  setFormData((prev) => ({ ...prev, postal_code: kodePos }));
}, [formData.sub_district]);


// // 2
  // useEffect(() => {
  //   if (!formData.sub_district) return;
  //   const postal = indonesiaData
  //     .filter((d) => d.sub_district === formData.sub_district)
  //     .map((d) => d.postalcode);
  //   setKodePosList([...new Set(postal)]);
  // }, [formData.sub_district]);

//   useEffect(() => {
//   if (!formData.sub_district) return;
//   const postal = indonesiaData
//     .filter((d) => d.sub_district === formData.sub_district)
//     .map((d) => d.postalcode);

//   const kodePos = postal.length > 0 ? postal[0] : "";
//   setFormData((prev) => ({ ...prev, postal_code: kodePos }));
// }, [formData.sub_district]);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((s) => ({ ...s, [name]: value }));
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, files } = e.target;
      const file = files?.[0] || null;

      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          setError(`Ukuran file ${name} melebihi 2MB`);
          e.currentTarget.value = "";
          return;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          setError(`Format ${name} harus JPG atau PNG`);
          e.currentTarget.value = "";
          return;
        }
      }

      setError("");
      setFormData((s) => ({ ...s, [name]: file }));

      if (name === "profile_photo") {
        if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
        const url = file ? URL.createObjectURL(file) : null;
        prevUrlRef.current = url;
        setProfilePreview(url);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setSuccess("");
      setError("");

      try {
        if (!user?.id) throw new Error("User belum login.");

        const payload = {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          nik: formData.nik,
          npwp: formData.npwp,
          birthPlace: formData.birth_place,
          birthDate: formData.birth_date,
          gender: formData.gender.toUpperCase(),
          maritalStatus: formData.marital_status.toUpperCase(),
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postal_code,
          occupation: formData.occupation,
          companyName: formData.company_name,
          monthlyIncome: Number(formData.monthly_income),
        };

        // const res = await updateUserProfile(user.id, payload);
        const res = await updateUserProfile(Number(user.id), payload);
        if (res.success) setSuccess("Profil berhasil diperbarui!");
        else setError(res.message || "Gagal memperbarui profil.");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    },
    [formData, user]
  );


  const genderOptions = useMemo(() => ["Laki-laki", "Perempuan"], []);
  const maritalOptions = useMemo(
    () => ["Belum Menikah", "Menikah", "Cerai"],
    []
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Ubah Profil</h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* FOTO PROFIL */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-4">Foto Profil</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 relative">
              <Image
                src={profilePreview || "/profile.png"}
                alt="Foto Profil"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div>
              <span className="block text-sm text-gray-600 font-medium mb-2">
                Upload JPG/PNG ≤ 2MB
              </span>
              <FileUpload
                name="profile_photo"
                label="Pilih File"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </section>

        {/* INFORMASI PRIBADI */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-4">
            Informasi Pribadi
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              name="full_name"
              label="Nama Lengkap"
              value={formData.full_name}
              onChange={handleChange}
            />
            <Field
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <Field
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
            <Field
              name="phone"
              label="Nomor HP"
              value={formData.phone}
              onChange={handleChange}
            />
            <Field
              name="nik"
              label="NIK"
              value={formData.nik}
              onChange={handleChange}
            />
            <Field
              name="npwp"
              label="NPWP"
              value={formData.npwp}
              onChange={handleChange}
            />
            <Field
              name="birth_place"
              label="Tempat Lahir"
              value={formData.birth_place}
              onChange={handleChange}
            />
            <Field
              name="birth_date"
              label="Tanggal Lahir"
              value={formData.birth_date}
              onChange={handleChange}
              type="date"
            />
            <SelectField
              name="gender"
              label="Jenis Kelamin"
              value={formData.gender}
              onChange={handleChange}
              options={genderOptions}
            />
            <SelectField
              name="marital_status"
              label="Status Pernikahan"
              value={formData.marital_status}
              onChange={handleChange}
              options={maritalOptions}
            />
          </div>
        </section>

        {/* ALAMAT DOMISILI */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-4">Alamat Domisili</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              name="address"
              label="Alamat Lengkap"
              value={formData.address}
              onChange={handleChange}
            />

            <SelectField
              name="province"
              label="Provinsi"
              value={formData.province}
              onChange={handleChange}
              options={provinsiList}
            />

            <SelectField
              name="city"
              label="Kota / Kabupaten"
              value={formData.city}
              onChange={handleChange}
              options={kotaList}
              disabled={!formData.province}
            />

            <SelectField
              name="sub_district"
              label="Kecamatan"
              value={formData.sub_district}
              onChange={handleChange}
              options={kecamatanList}
              disabled={!formData.city}
            />

            <SelectField
              name="postal_code"
              label="Kode Pos"
              value={formData.postal_code}
              onChange={handleChange}
              options={kodePosList}
              disabled={!formData.sub_district}
            />
          </div>
        </section>


        {/* DATA PEKERJAAN */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-4">Data Pekerjaan</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              name="occupation"
              label="Pekerjaan"
              value={formData.occupation}
              onChange={handleChange}
            />
            <Field
              name="monthly_income"
              label="Penghasilan Bulanan (Rp)"
              value={formData.monthly_income}
              onChange={handleChange}
              type="number"
            />
            <Field
              name="company_name"
              label="Nama Perusahaan"
              value={formData.company_name}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* DOKUMEN */}
        <section>
          <h3 className="font-semibold text-gray-800 mb-4">
            Dokumen Pendukung
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FileUpload
              name="ktp_photo"
              label="Foto KTP (JPG/PNG ≤ 2MB)"
              onChange={handleFileChange}
            />
            <FileUpload
              name="salary_slip_photo"
              label="Foto Slip Gaji (JPG/PNG ≤ 2MB)"
              onChange={handleFileChange}
            />
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
