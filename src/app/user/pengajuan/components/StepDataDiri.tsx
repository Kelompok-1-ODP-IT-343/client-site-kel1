"use client";

// import { InputField, SelectField } from "@/app/user/akun/Field";
import InputField from "../fields/InputField";
import SelectField from "../fields/SelectField";
import StepContent from "./StepContent";

export default function StepDataDiri({ formData, onChange, errors }: any) {
  return (
    <StepContent title="Data Diri">
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
        <InputField label="Nama Lengkap" name="fullName" required value={formData.fullName} onChange={onChange} error={errors.fullName} />
        <InputField label="NIK" name="nik" required maxLength={16} value={formData.nik} onChange={onChange} error={errors.nik} />
        <InputField label="Tempat Lahir" name="birthPlace" required value={formData.birthPlace} onChange={onChange} error={errors.birthPlace} />
        <InputField label="Tanggal Lahir" name="birthDate" type="date" required value={formData.birthDate} onChange={onChange} error={errors.birthDate} />

        <SelectField label="Jenis Kelamin" name="gender" required value={formData.gender} onChange={onChange} error={errors.gender}>
          <option value="">Pilih...</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </SelectField>

        <InputField label="Nomor Telepon" name="phone" required value={formData.phone} onChange={onChange} error={errors.phone} />
        <InputField label="Email" name="email" required type="email" value={formData.email} onChange={onChange} error={errors.email} />
        <InputField label="NPWP" name="npwp" required value={formData.npwp} onChange={onChange} error={errors.npwp} />

      </div>
    </StepContent>
  );
}
