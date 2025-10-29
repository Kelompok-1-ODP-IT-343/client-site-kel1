import { parseCurrency } from "./format";

export const validateStepData = (data: any, stepIndex: number) => {
  const errors: { [key: string]: string } = {};

  if (stepIndex === 0) {
    if (!data.fullName) errors.fullName = "Nama lengkap wajib diisi";
    if (!data.nik || data.nik.length !== 16)
      errors.nik = "NIK harus 16 digit";
    if (!data.npwp) errors.npwp = "NPWP wajib diisi";
  } else if (stepIndex === 1) {
    if (!data.address) errors.address = "Alamat wajib diisi";
    if (!data.subdistrict) errors.subdistrict = "Kelurahan wajib diisi";
    if (!data.district) errors.district = "Kecamatan wajib diisi";
  } else if (stepIndex === 2) {
    if (!data.occupation) errors.occupation = "Pekerjaan wajib diisi";
  } else if (stepIndex === 3) {
    if (!data.downPayment || parseCurrency(data.downPayment) <= 0)
      errors.downPayment = "Uang Muka wajib diisi";
    if (!data.loanTerm || Number(data.loanTerm) <= 0)
      errors.loanTerm = "Jangka Waktu wajib diisi";
    if (!data.fileKTP) errors.fileKTP = "Upload KTP wajib";
    if (!data.fileSlipGaji) errors.fileSlipGaji = "Upload Slip Gaji wajib";
    if (!data.agreeTerms)
      errors.agreeTerms = "Anda harus menyetujui kebijakan privasi";
  }

  return errors;
};
