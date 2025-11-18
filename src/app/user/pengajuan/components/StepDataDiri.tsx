"use client";

// import { InputField, SelectField } from "@/app/user/akun/Field";
import InputField from "../fields/InputField";
import SelectField from "../fields/SelectField";
import StepContent from "./StepContent";

export default function StepDataDiri({ formData, handleChange, errors }: any) {
  return (
    <StepContent title="Data Diri">
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Baris 1: Nama & Email */}
        <InputField label="Nama Lengkap" name="fullName" required value={formData.fullName} onChange={handleChange} error={errors.fullName} />
        <InputField label="Email" name="email" required type="email" value={formData.email} onChange={handleChange} error={errors.email} />

        {/* Baris 2: Tempat & Tanggal Lahir */}
        <InputField label="Tempat Lahir" name="birthPlace" required value={formData.birthPlace} onChange={handleChange} error={errors.birthPlace} />
        <InputField label="Tanggal Lahir" name="birthDate" type="date" required value={formData.birthDate} onChange={handleChange} error={errors.birthDate} />

        <SelectField label="Jenis Kelamin" name="gender" required value={formData.gender} onChange={handleChange} error={errors.gender}>
          <option value="">Pilih...</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </SelectField>

        <SelectField label="Status Perkawinan" name="maritalStatus" required value={formData.maritalStatus} onChange={handleChange} error={errors.maritalStatus}>
          <option value="">Pilih...</option>
          <option value="SINGLE">Belum Kawin</option>
          <option value="MARRIED">Kawin</option>
          <option value="DIVORCED">Cerai</option>
        </SelectField>

        {/* Baris 4: NIK & NPWP */}
        <InputField label="NIK" name="nik" required maxLength={16} value={formData.nik} onChange={handleChange} error={errors.nik} />
        <InputField label="NPWP" name="npwp" required value={formData.npwp} onChange={handleChange} error={errors.npwp} />

        {/* Baris 5: Nomor Telepon (setengah lebar seperti lainnya) */}
        <InputField label="Nomor Telepon" name="phone" required value={formData.phone} onChange={handleChange} error={errors.phone} />

      </div>
    </StepContent>
  );
}
