"use client";
import StepContent from "./StepContent";
import InputField from "../fields/InputField";

export default function StepPekerjaan({ formData, handleChange, errors }: any) {
  return (
    <StepContent title="Detail Pekerjaan & Pendapatan">
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
        <InputField required label="Pekerjaan Utama" name="occupation" value={formData.occupation} onChange={handleChange} error={errors.occupation} />
        <InputField required label="Nama Perusahaan / Instansi" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} />
        <InputField required label="Pendapatan Bersih per Bulan (Rp)" name="monthlyIncome" placeholder="Contoh: 10.000.000" value={formData.monthlyIncome} onChange={handleChange} error={errors.monthlyIncome} />
        <InputField required label="Lama Bekerja (Tahun)" name="workExperience" type="number" value={formData.workExperience} onChange={handleChange} error={errors.workExperience} placeholder="Contoh: 5"/>
      </div>
    </StepContent>
  );
}
