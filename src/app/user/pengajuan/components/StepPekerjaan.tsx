"use client";
import { useEffect, useState } from "react";
import StepContent from "./StepContent";
import InputField from "../fields/InputField";
import SelectField from "../fields/SelectField";
import { OCCUPATION_OPTIONS } from "@/app/user/constants/occupationOptions";
import rawData from "@/data/indonesia.json";
import { formatRegionLabel } from "@/app/lib/util";

type Row = {
  province: string;
  city: string;
  district: string;
  sub_district: string;
  postal_code: string;
};

export default function StepPekerjaan({ formData, handleChange, errors }: any) {
  const indonesiaData = rawData as Row[];

  // Lists untuk dropdown berantai alamat tempat bekerja
  const [provinsiKerjaList, setProvinsiKerjaList] = useState<string[]>([]);
  const [kotaKerjaList, setKotaKerjaList] = useState<string[]>([]);
  const [kecamatanKerjaList, setKecamatanKerjaList] = useState<string[]>([]);
  const [kelurahanKerjaList, setKelurahanKerjaList] = useState<string[]>([]);
  const [kodePosKerjaList, setKodePosKerjaList] = useState<string[]>([]);

  // Inisialisasi provinsi
  useEffect(() => {
    const provinces = [...new Set(indonesiaData.map((d) => d.province))];
    setProvinsiKerjaList(provinces);
  }, [indonesiaData]);

  useEffect(() => {
    if (!formData.companyProvince) {
      setKotaKerjaList([]);
      setKecamatanKerjaList([]);
      setKelurahanKerjaList([]);
      setKodePosKerjaList([]);
      return;
    }
    const cities = indonesiaData
      .filter((d) => d.province === formData.companyProvince)
      .map((d) => d.city);
    const uniqueCities = [...new Set(cities)];
    setKotaKerjaList(uniqueCities);
    const currentCity = formData.companyCity || "";
    const validCity = uniqueCities.includes(currentCity);
    if (!validCity) {
      setKecamatanKerjaList([]);
      setKelurahanKerjaList([]);
      setKodePosKerjaList([]);
      handleChange({ target: { name: "companyCity", value: "" } } as any);
      handleChange({ target: { name: "companyDistrict", value: "" } } as any);
      handleChange({ target: { name: "companySubdistrict", value: "" } } as any);
      handleChange({ target: { name: "companyPostalCode", value: "" } } as any);
    }
  }, [formData.companyProvince]);

  useEffect(() => {
    if (!formData.companyCity) {
      setKecamatanKerjaList([]);
      setKelurahanKerjaList([]);
      setKodePosKerjaList([]);
      return;
    }
    const districts = indonesiaData
      .filter((d) => d.city === formData.companyCity)
      .map((d) => d.district);
    const uniqueDistricts = [...new Set(districts)];
    setKecamatanKerjaList(uniqueDistricts);
    const currentDistrict = formData.companyDistrict || "";
    const validDistrict = uniqueDistricts.includes(currentDistrict);
    if (!validDistrict) {
      setKelurahanKerjaList([]);
      setKodePosKerjaList([]);
      handleChange({ target: { name: "companyDistrict", value: "" } } as any);
      handleChange({ target: { name: "companySubdistrict", value: "" } } as any);
      handleChange({ target: { name: "companyPostalCode", value: "" } } as any);
    }
  }, [formData.companyCity]);

  useEffect(() => {
    if (!formData.companyDistrict) {
      setKelurahanKerjaList([]);
      setKodePosKerjaList([]);
      return;
    }
    const subs = indonesiaData
      .filter((d) => d.district === formData.companyDistrict)
      .map((d) => d.sub_district);
    const uniqueSubs = [...new Set(subs)];
    setKelurahanKerjaList(uniqueSubs);
    const currentSub = formData.companySubdistrict || "";
    const validSub = uniqueSubs.includes(currentSub);
    if (!validSub) {
      setKodePosKerjaList([]);
      handleChange({ target: { name: "companySubdistrict", value: "" } } as any);
      handleChange({ target: { name: "companyPostalCode", value: "" } } as any);
    }
  }, [formData.companyDistrict]);

  // Saat kelurahan kerja berubah, set daftar kode pos
  useEffect(() => {
    if (!formData.companySubdistrict) {
      setKodePosKerjaList([]);
      return;
    }
    const postal = indonesiaData
      .filter((d) => d.sub_district === formData.companySubdistrict)
      .map((d) => d.postal_code);
    const uniquePostal = [...new Set(postal)];
    setKodePosKerjaList(uniquePostal);
    // Auto pilih kode pos pertama jika belum valid
    const current = formData.companyPostalCode || "";
    const next = uniquePostal.includes(current) ? current : uniquePostal[0] || "";
    handleChange({ target: { name: "companyPostalCode", value: next } } as any);
  }, [formData.companySubdistrict]);

  return (
    <StepContent title="Detail Pekerjaan & Pendapatan">
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
        <SelectField
          required
          label="Pekerjaan Utama"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          error={errors.occupation}
        >
          <option value="">Pilih...</option>
          {OCCUPATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SelectField>
        <InputField required label="Nama Perusahaan / Instansi" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} />
        <InputField required label="Alamat Perusahaan" name="companyAddress" value={formData.companyAddress} onChange={handleChange} error={errors.companyAddress} />
        <SelectField required label="Provinsi Tempat Bekerja" name="companyProvince" value={formData.companyProvince} onChange={handleChange} error={errors.companyProvince}>
          <option value="">Pilih...</option>
          {provinsiKerjaList.map((p) => (
            <option key={p} value={p}>{formatRegionLabel(p)}</option>
          ))}
        </SelectField>

        <SelectField required label="Kota / Kabupaten Tempat Bekerja" name="companyCity" value={formData.companyCity} onChange={handleChange} error={errors.companyCity} disabled={!formData.companyProvince}>
          <option value="">Pilih...</option>
          {kotaKerjaList.map((c) => (
            <option key={c} value={c}>{formatRegionLabel(c)}</option>
          ))}
        </SelectField>

        <SelectField required label="Kecamatan Tempat Bekerja" name="companyDistrict" value={formData.companyDistrict} onChange={handleChange} error={errors.companyDistrict} disabled={!formData.companyCity}>
          <option value="">Pilih...</option>
          {kecamatanKerjaList.map((k) => (
            <option key={k} value={k}>{formatRegionLabel(k)}</option>
          ))}
        </SelectField>

        <SelectField required label="Kelurahan Tempat Bekerja" name="companySubdistrict" value={formData.companySubdistrict} onChange={handleChange} error={errors.companySubdistrict} disabled={!formData.companyDistrict}>
          <option value="">Pilih...</option>
          {kelurahanKerjaList.map((s) => (
            <option key={s} value={s}>{formatRegionLabel(s)}</option>
          ))}
        </SelectField>

        <SelectField required label="Kode Pos Tempat Bekerja" name="companyPostalCode" value={formData.companyPostalCode} onChange={handleChange} error={errors.companyPostalCode} disabled={!formData.companySubdistrict}>
          <option value="">Pilih...</option>
          {kodePosKerjaList.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </SelectField>
        <InputField required label="Pendapatan Bersih per Bulan (Rp)" name="monthlyIncome" placeholder="Contoh: 10.000.000" value={formData.monthlyIncome} onChange={handleChange} error={errors.monthlyIncome} />
      </div>
    </StepContent>
  );
}
