"use client";
import StepContent from "./StepContent";
import InputField from "../fields/InputField";
import SelectField from "../fields/SelectField";
import { OCCUPATION_OPTIONS } from "@/app/user/constants/occupationOptions";

export default function StepPekerjaan({ formData, handleChange, errors }: any) {
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
        <InputField required label="Kelurahan Perusahaan" name="companySubdistrict" value={formData.companySubdistrict} onChange={handleChange} error={errors.companySubdistrict} />
        <InputField required label="Kecamatan Perusahaan" name="companyDistrict" value={formData.companyDistrict} onChange={handleChange} error={errors.companyDistrict} />
        <InputField required label="Kota / Kabupaten Perusahaan" name="companyCity" value={formData.companyCity} onChange={handleChange} error={errors.companyCity} />
        <InputField required label="Provinsi Perusahaan" name="companyProvince" value={formData.companyProvince} onChange={handleChange} error={errors.companyProvince} />
        <InputField required label="Kode Pos Perusahaan" name="companyPostalCode" value={formData.companyPostalCode} maxLength={5} onChange={handleChange} error={errors.companyPostalCode} />
        <InputField required label="Pendapatan Bersih per Bulan (Rp)" name="monthlyIncome" placeholder="Contoh: 10.000.000" value={formData.monthlyIncome} onChange={handleChange} error={errors.monthlyIncome} />
      </div>
    </StepContent>
  );
}