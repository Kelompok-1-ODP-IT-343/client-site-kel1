"use client";
import { useEffect, useState } from "react";
import StepContent from "./StepContent";
import TextAreaField from "../fields/TextAreaField";
import SelectField from "../fields/SelectField";
import rawData from "@/data/indonesia.json";
import { formatRegionLabel } from "@/app/lib/util";

type Row = {
  province: string;
  city: string;
  district: string;
  sub_district: string;
  postal_code: string;
};

export default function StepAlamat({ formData, handleChange, errors }: any) {
  const indonesiaData = rawData as Row[];

  const [provinsiList, setProvinsiList] = useState<string[]>([]);
  const [kotaList, setKotaList] = useState<string[]>([]);
  const [kecamatanList, setKecamatanList] = useState<string[]>([]);
  const [kelurahanList, setKelurahanList] = useState<string[]>([]);
  const [kodePosList, setKodePosList] = useState<string[]>([]);

  // Inisialisasi provinsi
  useEffect(() => {
    const provinces = [...new Set(indonesiaData.map((d) => d.province))];
    setProvinsiList(provinces);
  }, [indonesiaData]);

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
    const uniqueCities = [...new Set(cities)];
    setKotaList(uniqueCities);
    const currentCity = formData.city || "";
    const validCity = uniqueCities.includes(currentCity);
    if (!validCity) {
      setKecamatanList([]);
      setKelurahanList([]);
      setKodePosList([]);
      handleChange({ target: { name: "city", value: "" } } as any);
      handleChange({ target: { name: "district", value: "" } } as any);
      handleChange({ target: { name: "subdistrict", value: "" } } as any);
      handleChange({ target: { name: "postalCode", value: "" } } as any);
    }
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
    const uniqueDistricts = [...new Set(districts)];
    setKecamatanList(uniqueDistricts);
    const currentDistrict = formData.district || "";
    const validDistrict = uniqueDistricts.includes(currentDistrict);
    if (!validDistrict) {
      setKelurahanList([]);
      setKodePosList([]);
      handleChange({ target: { name: "district", value: "" } } as any);
      handleChange({ target: { name: "subdistrict", value: "" } } as any);
      handleChange({ target: { name: "postalCode", value: "" } } as any);
    }
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
    const uniqueSubs = [...new Set(subs)];
    setKelurahanList(uniqueSubs);
    const currentSub = formData.subdistrict || "";
    const validSub = uniqueSubs.includes(currentSub);
    if (!validSub) {
      setKodePosList([]);
      handleChange({ target: { name: "subdistrict", value: "" } } as any);
      handleChange({ target: { name: "postalCode", value: "" } } as any);
    }
  }, [formData.district]);

  // Saat kelurahan berubah, set daftar kode pos
  useEffect(() => {
    if (!formData.subdistrict) {
      setKodePosList([]);
      return;
    }
    const postal = indonesiaData
      .filter((d) => d.sub_district === formData.subdistrict)
      .map((d) => d.postal_code);
    const uniquePostal = [...new Set(postal)];
    setKodePosList(uniquePostal);
    // Auto pilih kode pos pertama jika belum valid
    const current = formData.postalCode || "";
    const next = uniquePostal.includes(current) ? current : uniquePostal[0] || "";
    handleChange({ target: { name: "postalCode", value: next } } as any);
  }, [formData.subdistrict]);

  return (
    <StepContent title="Informasi Alamat Tempat Tinggal">
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
        <TextAreaField required label="Alamat Sesuai KTP" name="address" value={formData.address} onChange={handleChange} error={errors.address} />

        <SelectField required label="Provinsi" name="province" value={formData.province} onChange={handleChange} error={errors.province}>
          <option value="">Pilih...</option>
          {provinsiList.map((p) => (
            <option key={p} value={p}>{formatRegionLabel(p)}</option>
          ))}
        </SelectField>

        <SelectField required label="Kota / Kabupaten" name="city" value={formData.city} onChange={handleChange} error={errors.city} disabled={!formData.province}>
          <option value="">Pilih...</option>
          {kotaList.map((c) => (
            <option key={c} value={c}>{formatRegionLabel(c)}</option>
          ))}
        </SelectField>

        <SelectField required label="Kecamatan" name="district" value={formData.district} onChange={handleChange} error={errors.district} disabled={!formData.city}>
          <option value="">Pilih...</option>
          {kecamatanList.map((k) => (
            <option key={k} value={k}>{formatRegionLabel(k)}</option>
          ))}
        </SelectField>

        <SelectField required label="Kelurahan" name="subdistrict" value={formData.subdistrict} onChange={handleChange} error={errors.subdistrict} disabled={!formData.district}>
          <option value="">Pilih...</option>
          {kelurahanList.map((s) => (
            <option key={s} value={s}>{formatRegionLabel(s)}</option>
          ))}
        </SelectField>

        <SelectField required label="Kode Pos" name="postalCode" value={formData.postalCode} onChange={handleChange} error={errors.postalCode} disabled={!formData.subdistrict}>
          <option value="">Pilih...</option>
          {kodePosList.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </SelectField>
      </div>
    </StepContent>
  );
}
