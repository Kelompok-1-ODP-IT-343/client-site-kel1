"use client";
import StepContent from "./StepContent";
import InputField from "../fields/InputField";
import SelectField from "../fields/SelectField";

const OCCUPATION_OPTIONS = [
  { value: "BELUM_TIDAK_BEKERJA", label: "Belum Tidak Bekerja" },
  { value: "MENGURUS_RUMAH_TANGGA", label: "Mengurus Rumah Tangga" },
  { value: "PELAJAR_MAHASISWA", label: "Pelajar Mahasiswa" },
  { value: "PENSIUNAN", label: "Pensiunan" },
  { value: "PNS", label: "PNS" },
  { value: "TNI", label: "TNI" },
  { value: "POLRI", label: "POLRI" },
  { value: "KARYAWAN_SWASTA", label: "Karyawan Swasta" },
  { value: "KARYAWAN_BUMN", label: "Karyawan BUMN" },
  { value: "KARYAWAN_BUMD", label: "Karyawan BUMD" },
  { value: "KARYAWAN_HONORER", label: "Karyawan Honorer" },
  { value: "WIRASWASTA", label: "Wiraswasta" },
  { value: "PERDAGANGAN", label: "Perdagangan" },
  { value: "PETANI_PEKEBUN", label: "Petani Pekebun" },
  { value: "PETERNAK", label: "Peternak" },
  { value: "NELAYAN_PERIKANAN", label: "Nelayan Perikanan" },
  { value: "INDUSTRI", label: "Industri" },
  { value: "KONSTRUKSI", label: "Konstruksi" },
  { value: "TRANSPORTASI", label: "Transportasi" },
  { value: "BURUH_HARIAN_LEPAS", label: "Buruh Harian Lepas" },
  { value: "BURUH_TANI_PERKEBUNAN", label: "Buruh Tani Perkebunan" },
  { value: "BURUH_NELAYAN_PERIKANAN", label: "Buruh Nelayan Perikanan" },
  { value: "BURUH_PETERNAKAN", label: "Buruh Peternakan" },
  { value: "PEMBANTU_RUMAH_TANGGA", label: "Pembantu Rumah Tangga" },
];

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
        <InputField required label="Pendapatan Bersih per Bulan (Rp)" name="monthlyIncome" placeholder="Contoh: 10.000.000" value={formData.monthlyIncome} onChange={handleChange} error={errors.monthlyIncome} />
        <InputField required label="Lama Bekerja (Tahun)" name="workExperience" type="number" value={formData.workExperience} onChange={handleChange} error={errors.workExperience} placeholder="Contoh: 5"/>
      </div>
    </StepContent>
  );
}
