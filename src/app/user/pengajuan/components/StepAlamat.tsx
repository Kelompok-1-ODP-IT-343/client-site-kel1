"use client";
import StepContent from "./StepContent";
import InputField from "../fields/InputField";
import TextAreaField from "../fields/TextAreaField";

export default function StepAlamat({ formData, handleChange, errors }: any) {
  return (
    <StepContent title="Informasi Alamat Tempat Tinggal">
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
        <TextAreaField required label="Alamat Sesuai KTP" name="address" value={formData.address} onChange={handleChange} error={errors.address} />

        <InputField required label="Kelurahan" name="subdistrict" value={formData.subdistrict} onChange={handleChange} error={errors.subdistrict} />
        <InputField required label="Kecamatan" name="district" value={formData.district} onChange={handleChange} error={errors.district} />

        <InputField required label="Kota / Kabupaten" name="city" value={formData.city} onChange={handleChange} error={errors.city} />
        <InputField required label="Provinsi" name="province" value={formData.province} onChange={handleChange} error={errors.province} />
        <InputField required label="Kode Pos" name="postalCode" value={formData.postalCode} maxLength={5} onChange={handleChange} error={errors.postalCode} />
      </div>
    </StepContent>
  );
}
