"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import Field from "@/app/user/akun/Field";
import SelectField from "@/app/user/akun/SelectField";
import FileUpload from "@/app/user/akun/FileUpload";

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

  useEffect(() => {
    const t = setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
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
      }));
    }, 250);
    return () => clearTimeout(t);
  }, []);

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
        const form = new FormData();
        Object.entries(formData).forEach(([k, v]) => form.append(k, v as any));

        const res = await fetch("/api/profile/update", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal update profil");

        setSuccess(data.message || "Profil berhasil diperbarui");
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    },
    [formData]
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
            <Field
              name="sub_district"
              label="Kelurahan"
              value={formData.sub_district}
              onChange={handleChange}
            />
            <Field
              name="district"
              label="Kecamatan"
              value={formData.district}
              onChange={handleChange}
            />
            <Field
              name="city"
              label="Kota / Kabupaten"
              value={formData.city}
              onChange={handleChange}
            />
            <Field
              name="province"
              label="Provinsi"
              value={formData.province}
              onChange={handleChange}
            />
            <Field
              name="postal_code"
              label="Kode Pos"
              value={formData.postal_code}
              onChange={handleChange}
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
            <Field
              name="company_address"
              label="Alamat Kantor"
              value={formData.company_address}
              onChange={handleChange}
            />
            <Field
              name="company_subdistrict"
              label="Kelurahan Kantor"
              value={formData.company_subdistrict}
              onChange={handleChange}
            />
            <Field
              name="company_district"
              label="Kecamatan Kantor"
              value={formData.company_district}
              onChange={handleChange}
            />
            <Field
              name="company_city"
              label="Kota Kantor"
              value={formData.company_city}
              onChange={handleChange}
            />
            <Field
              name="company_province"
              label="Provinsi Kantor"
              value={formData.company_province}
              onChange={handleChange}
            />
            <Field
              name="company_postal_code"
              label="Kode Pos Kantor"
              value={formData.company_postal_code}
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
