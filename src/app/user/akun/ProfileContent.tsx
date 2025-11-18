"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Field from "@/app/user/akun/Field";
import SelectField from "@/app/user/akun/SelectField";
import FileUpload from "@/app/user/akun/FileUpload";
import { useAuth } from "@/app/lib/authContext";
import { updateUserProfile } from "@/app/lib/coreApi";
import { OCCUPATION_OPTIONS } from "@/app/user/constants/occupationOptions";

import { getCookie } from "@/app/lib/cookie";
import { API_BASE_URL, API_ENDPOINTS } from "@/app/lib/apiConfig";
import { fetchWithAuth } from "@/app/lib/authFetch";
import rawData from "@/data/indonesia.json";
import { formatRegionLabel } from "@/app/lib/util";

import {
  ALLOWED_TYPES,
  DEFAULT_PROFILE,
  MAX_FILE_SIZE,
} from "@/app/user/akun/constants";
import { ProfileForm } from "@/app/user/akun/types";
import Dialog from "@/components/ui/Dialog";

export default function ProfilContent() {
  const [formData, setFormData] = useState<ProfileForm>({ ...DEFAULT_PROFILE });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ nik?: string; npwp?: string }>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);
  const indonesiaData = rawData as {
    province: string;
    city: string;
    district: string;
    sub_district: string; // kelurahan
    postal_code: string;
  }[];
  const [provinsiList, setProvinsiList] = useState<string[]>([]);
  const [kotaList, setKotaList] = useState<string[]>([]);
  const [kecamatanList, setKecamatanList] = useState<string[]>([]);
  const [kelurahanList, setKelurahanList] = useState<string[]>([]);
  const [kodePosList, setKodePosList] = useState<string[]>([]);

  // Label map untuk Title Case tampilan dropdown wilayah
  const provinceLabelMap = useMemo(
    () => Object.fromEntries(provinsiList.map((v) => [v, formatRegionLabel(v)])),
    [provinsiList]
  );
  const cityLabelMap = useMemo(
    () => Object.fromEntries(kotaList.map((v) => [v, formatRegionLabel(v)])),
    [kotaList]
  );
  const districtLabelMap = useMemo(
    () => Object.fromEntries(kecamatanList.map((v) => [v, formatRegionLabel(v)])),
    [kecamatanList]
  );
  const subDistrictLabelMap = useMemo(
    () => Object.fromEntries(kelurahanList.map((v) => [v, formatRegionLabel(v)])),
    [kelurahanList]
  );

  const { user, login } = useAuth();

  // Util: default and normalize phone number
  const normalizePhone = (val?: string | null) => {
    const raw = String(val || "").trim();
    if (!raw) return "62"; // default prefix Indonesia
    if (raw.startsWith("+62")) return raw.replace(/^\+/, "");
    if (raw.startsWith("0")) return `62${raw.slice(1)}`;
    return raw;
  };

  // Util: initials from full name
  const getInitials = (fullName?: string | null) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(/\s+/);
    const a = parts[0]?.[0] || "";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase() || "U";
  };

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        if (!user?.id) return;

        const res = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.USER_PROFILE}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        console.log("Response Profil:", json); 
        console.log("==== FETCH USER PROFILE RESPONSE ====");
  console.log("URL:", `${API_BASE_URL}${API_ENDPOINTS.USER_PROFILE}`);
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
            phone: normalizePhone(d.phone),
            nik: d.nik || "",
            npwp: d.npwp || "",
            birth_date: d.birthDate || "",
            birth_place: d.birthPlace || "",
            gender: String(d.gender || "").toUpperCase() === "FEMALE" ? "Perempuan" : "Laki-laki",
            marital_status: (() => {
              const ms = String(d.maritalStatus || "").toUpperCase();
              if (ms === "SINGLE") return "Belum Menikah";
              if (ms === "MARRIED") return "Menikah";
              if (ms === "DIVORCED") return "Cerai";
              return "Belum Menikah";
            })(),
            address: d.address || "",
            city: d.city || "",
            province: d.province || "",
            district: d.district || "",
            sub_district: d.subDistrict || d.sub_district || "",
            postal_code: d.postalCode || d.postal_code || "",
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
    if (!formData.province) {
      setKotaList([]);
      setKecamatanList([]);
      setKelurahanList([]);
      setKodePosList([]);
      return;
    }
    const cities = indonesiaData
      .filter((d) => d.province === formData.province)
      .map((d) => d.city);
    setKotaList([...new Set(cities)]);
    setKecamatanList([]);
    setKelurahanList([]);
    setKodePosList([]);
  }, [formData.province]);

  useEffect(() => {
    if (!formData.city) {
      setKecamatanList([]);
      setKelurahanList([]);
      setKodePosList([]);
      return;
    }
    const districts = indonesiaData
      .filter((d) => d.city === formData.city)
      .map((d) => d.district);
    setKecamatanList([...new Set(districts)]);
    setKelurahanList([]);
    setKodePosList([]);
  }, [formData.city]);

  useEffect(() => {
    if (!formData.district) {
      setKelurahanList([]);
      setKodePosList([]);
      return;
    }
    const subs = indonesiaData
      .filter((d) => d.district === formData.district)
      .map((d) => d.sub_district);
    setKelurahanList([...new Set(subs)]);
    setKodePosList([]);
  }, [formData.district]);

useEffect(() => {
  if (!formData.sub_district) return;
  const postal = indonesiaData
    .filter((d) => d.sub_district === formData.sub_district)
    .map((d) => d.postal_code);

  const uniquePostal = [...new Set(postal)];
  setKodePosList(uniquePostal);

  // Set nilai default jika belum ada atau tidak valid
  setFormData((prev) => ({
    ...prev,
    postal_code:
      prev.postal_code && uniquePostal.includes(prev.postal_code)
        ? prev.postal_code
        : uniquePostal[0] || "",
  }));
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
      // Khusus NIK/NPWP: hanya angka, maksimal 16 digit + validasi segera
      if (name === "nik" || name === "npwp") {
        const digits = String(value).replace(/[^0-9]/g, "").slice(0, 16);
        setFormData((s) => ({ ...s, [name]: digits }));
        setFieldErrors((prev) => ({
          ...prev,
          [name]: digits.length === 16 ? undefined : `${name.toUpperCase()} harus tepat 16 digit`,
        }));
        return;
      }
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
      setFieldErrors({});

      try {
        if (!user?.id) throw new Error("User belum login.");

        // Validasi lokal untuk NIK dan NPWP (tepat 16 digit)
        const localErr: { nik?: string; npwp?: string } = {};
        const nikDigits = String(formData.nik || "");
        const npwpDigits = String(formData.npwp || "");
        if (nikDigits.length !== 16) localErr.nik = "NIK harus tepat 16 digit";
        if (npwpDigits.length !== 16) localErr.npwp = "NPWP harus tepat 16 digit";
        if (localErr.nik || localErr.npwp) {
          setFieldErrors(localErr);
          setLoading(false);
          return;
        }

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
          district: formData.district,
          subDistrict: formData.sub_district,
          postalCode: formData.postal_code,
          occupation: formData.occupation,
          companyName: formData.company_name,
          monthlyIncome: Number(formData.monthly_income),
          status: "ACTIVE",
          fullName: formData.full_name,
        };

        // const res = await updateUserProfile(user.id, payload);
        const res = await updateUserProfile(Number(user.id), payload);
        if (res.success) {
          setSuccess("Profil berhasil diperbarui!");
          setShowSuccessDialog(true);
          // Sinkronkan nama (dan foto bila tersedia) ke AuthContext + localStorage agar header ikut ter-update
          const newFullName = formData.full_name?.trim() || user.fullName;
          const newPhoto = (res.data?.photoUrl || user.photoUrl) as string | undefined;
          login({ id: user.id, fullName: newFullName, photoUrl: newPhoto });
        } else {
          // Jika validasi server gagal, tampilkan pesan di bawah field dan sembunyikan pesan umum "Validation failed"
          const msg = String(res.message || "");
          if (/^validation failed$/i.test(msg)) {
            const nikErr = (res as any)?.data?.nik;
            const npwpErr = (res as any)?.data?.npwp;
            setFieldErrors({
              nik: nikErr ? "NIK harus tepat 16 digit" : undefined,
              npwp: npwpErr ? "NPWP harus tepat 16 digit" : undefined,
            });
          } else {
            setError(msg || "Gagal memperbarui profil.");
          }
        }
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-bni-orange text-white grid place-items-center font-bold">
          {getInitials(formData.full_name || user?.fullName)}
        </div>
        <div>
          <h2 className="text-xl font-bold leading-tight">{formData.full_name || user?.fullName || "Pengguna"}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">

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
              error={fieldErrors.nik}
            />
            <Field
              name="npwp"
              label="NPWP"
              value={formData.npwp}
              onChange={handleChange}
              error={fieldErrors.npwp}
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
              labelMap={provinceLabelMap}
            />

            <SelectField
              name="city"
              label="Kota / Kabupaten"
              value={formData.city}
              onChange={handleChange}
              options={kotaList}
              labelMap={cityLabelMap}
              disabled={!formData.province}
            />

            <SelectField
              name="district"
              label="Kecamatan"
              value={formData.district}
              onChange={handleChange}
              options={kecamatanList}
              labelMap={districtLabelMap}
              disabled={!formData.city}
            />

            <SelectField
              name="sub_district"
              label="Kelurahan"
              value={formData.sub_district}
              onChange={handleChange}
              options={kelurahanList}
              labelMap={subDistrictLabelMap}
              disabled={!formData.district}
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
            <SelectField
              name="occupation"
              label="Pekerjaan"
              value={formData.occupation}
              onChange={handleChange}
              options={OCCUPATION_OPTIONS.map((o) => o.value)}
              labelMap={Object.fromEntries(
                OCCUPATION_OPTIONS.map((o) => [o.value, o.label])
              )}
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
          {error && !/^validation failed$/i.test(error) && (
            <p className="text-[#FF8500] text-sm">{error}</p>
          )}
          {/* Dialog sukses akan menampilkan pesan, tidak perlu teks inline */}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-[#FF8500] text-white font-semibold hover:bg-[#e67800] disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        <Dialog
          open={showSuccessDialog}
          title="Berhasil"
          description={<p>Profil berhasil diperbarui!</p>}
          onClose={() => setShowSuccessDialog(false)}
          actions={
            <button
              type="button"
              onClick={() => setShowSuccessDialog(false)}
              className="px-4 py-2 rounded-md bg-[#FF8500] text-white hover:bg-[#e67800]"
            >
              Oke
            </button>
          }
        />
      </form>
    </div>
  );
}
