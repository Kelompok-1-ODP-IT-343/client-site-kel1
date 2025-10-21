"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, ArrowRight, User, Briefcase, FileText, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allHouses } from '@/app/lib/propertyData';

const formatCurrency = (amount: string | number): string => {
    const numValue = String(amount).replace(/[^0-9]/g, "");
    const num = Number(numValue);
    if (isNaN(num)) return "";
    const formatted = new Intl.NumberFormat('id-ID').format(num);
    return formatted === '0' ? '' : formatted;
};
const parseCurrency = (formattedValue: string): number => {
    const numValue = formattedValue.replace(/[^0-9]/g, "");
    return Number(numValue) || 0;
};
const formatNumberOnly = (value: string) => value.replace(/[^0-9]/g, "");

interface InputFieldProps { label: string; name: string; type?: string; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; required?: boolean; readOnly?: boolean; maxLength?: number; }
const InputField: React.FC<InputFieldProps> = ({ label, name, type = 'text', placeholder, value, onChange, error, required, readOnly = false, maxLength }) => ( <div className="flex flex-col"> <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1.5"> {label} {required && <span className="text-red-500">*</span>} </label> <input id={name} name={name} type={type} placeholder={placeholder} value={value || ''} onChange={onChange} readOnly={readOnly} maxLength={maxLength} className={`rounded-lg border border-gray-300 text-gray-900 focus:border-bni-teal focus:ring-1 focus:ring-bni-teal px-4 py-2.5 outline-none transition ${readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''} ${error ? 'border-red-500 ring-1 ring-red-200' : ''}`} /> {error && <p className="mt-1 text-xs text-red-500">{error}</p>} </div> );
interface SelectFieldProps { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; error?: string; required?: boolean; children: ReactNode; }
const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, error, required, children }) => ( <div className="flex flex-col"> <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1.5"> {label} {required && <span className="text-red-500">*</span>} </label> <select id={name} name={name} value={value} onChange={onChange} className={`rounded-lg border border-gray-300 text-gray-900 focus:border-bni-teal focus:ring-1 focus:ring-bni-teal px-4 py-2.5 outline-none transition appearance-none bg-white ${error ? 'border-red-500 ring-1 ring-red-200' : ''}`} required={required}> {children} </select> {error && <p className="mt-1 text-xs text-red-500">{error}</p>} </div> );
interface TextAreaFieldProps { label: string; name: string; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; error?: string; required?: boolean; }
const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, name, placeholder, value, onChange, error, required }) => ( <div className="flex flex-col md:col-span-2"> <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1.5"> {label} {required && <span className="text-red-500">*</span>} </label> <textarea id={name} name={name} placeholder={placeholder} value={value} onChange={onChange} rows={3} className={`rounded-lg border border-gray-300 text-gray-900 focus:border-bni-teal focus:ring-1 focus:ring-bni-teal px-4 py-2.5 outline-none transition ${error ? 'border-red-500 ring-1 ring-red-200' : ''}`} required={required} /> {error && <p className="mt-1 text-xs text-red-500">{error}</p>} </div> );
interface FileInputFieldProps { label: string; name: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; required?: boolean; file: File | null; }
const FileInputField: React.FC<FileInputFieldProps> = ({ label, name, onChange, error, required, file }) => ( <div className="flex flex-col"> <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1.5"> {label} {required && <span className="text-red-500">*</span>} </label> <input id={name} name={name} type="file" onChange={onChange} accept=".pdf,.jpg,.jpeg,.png" className={`file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-bni-teal/10 file:text-bni-teal hover:file:bg-bni-teal/20 block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none ${error ? 'border-red-500 ring-1 ring-red-200' : ''}`} required={required} /> {file && <p className="mt-1 text-xs text-gray-500">File: {file.name}</p>} {error && <p className="mt-1 text-xs text-red-500">{error}</p>} </div> );
const StepContent = ({ title, children }: { title: string; children: ReactNode }) => ( <div> <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2> {children} </div> );
type StepProps = { formData: any; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; errors: { [key: string]: string }; }

export default function FormPengajuanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [step, setStep] = useState(0); // Current step index (0-based)
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    fullName: "", nik: "", birthPlace: "", birthDate: "", gender: "", maritalStatus: "", phone: "", email: "", npwp: "",
    address: "", subdistrict: "", district: "",  city: "", province: "", postalCode: "",
    occupation: "", companyName: "", companyAddress: "", monthlyIncome: "", workExperience: "",
    downPayment: "", loanTerm: "",
    fileKTP: null as File | null,
    fileSlipGaji: null as File | null,
    agreePrivacy: false,
  });

  const steps = ["Data Diri", "Alamat", "Pekerjaan", "Pengajuan"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      const files = (e.target as HTMLInputElement).files;
      let finalValue: string | boolean | File | null = type === 'checkbox' ? checked : value;
      if (type === 'file' && files) finalValue = files[0] || null;
      else if (name === "nik") finalValue = formatNumberOnly(value).slice(0, 16);
      else if (name === "postalCode") finalValue = formatNumberOnly(value).slice(0, 5);
      else if (name === "monthlyIncome" || name === "downPayment") finalValue = formatCurrency(value);
      else if (name === "workExperience" || name === "loanTerm") finalValue = formatNumberOnly(value);
      setFormData(prev => ({ ...prev, [name]: finalValue }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateStep = (currentStepIndex: number): boolean => {
      const newErrors: { [key: string]: string } = {};
      const data = formData;
      if (currentStepIndex === 0) {
          if (!data.fullName) newErrors.fullName = "Nama lengkap wajib diisi";
          if (!data.nik || data.nik.length !== 16) newErrors.nik = "NIK harus 16 digit";
          if (!data.npwp) newErrors.npwp = "NPWP wajib diisi";
         
      } else if (currentStepIndex === 1) {
          if (!data.address) newErrors.address = "Alamat wajib diisi";
          if (!data.subdistrict) newErrors.subdistrict = "Kelurahan wajib diisi";
          if (!data.district) newErrors.district = "Kecamatan wajib diisi";

      } else if (currentStepIndex === 2) {
          if (!data.occupation) newErrors.occupation = "Pekerjaan wajib diisi";
         
      } else if (currentStepIndex === 3) {
          if (!data.downPayment || parseCurrency(data.downPayment) <= 0) newErrors.downPayment = "Uang Muka wajib diisi";
          if (!data.loanTerm || Number(data.loanTerm) <= 0) newErrors.loanTerm = "Jangka Waktu wajib diisi";
          if (!data.fileKTP) newErrors.fileKTP = "Upload KTP wajib";
          if (!data.fileSlipGaji) newErrors.fileSlipGaji = "Upload Slip Gaji wajib";
          if (!data.agreePrivacy) newErrors.agreePrivacy = "Anda harus menyetujui kebijakan privasi";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep((s) => Math.min(s + 1, steps.length - 1)); };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(steps.length - 1)) {
        setIsLoading(true);
        console.log("Mengirim data pengajuan:", { ...formData, ...applicationData });
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        alert("Pengajuan berhasil dikirim! (Demo)");
    }
  };

  const applicationData = {
      propertiId: searchParams.get('propertiId'),
      propertiNama: searchParams.get('propertiNama'),
      propertiLokasi: searchParams.get('propertiLokasi'),
      hargaProperti: searchParams.get('hargaProperti') || '0',
      image: allHouses.find(h => h.id.toString() === searchParams.get('propertiId'))?.image || '/rumah-default.jpg'
  };

  return (
    <main className="flex-grow py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border">
        <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-4">Formulir Pengajuan KPR</h1>
        <p className="text-center text-gray-500 mb-10">Lengkapi data di bawah ini untuk melanjutkan proses pengajuan Anda.</p>
        
        <div className="w-full px-4 sm:px-0 mb-12">
            <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200"></div>
                <div 
                    className="absolute top-5 left-0 h-0.5 bg-bni-orange transition-all duration-500"
                    style={{ width: `${(step / (steps.length - 1)) * 100}%` }} // Progress line
                ></div>
                
                <div className="flex justify-between items-start relative">
                    {steps.map((label, i) => {
                        const isCompleted = i < step;
                        const isActive = i === step;
                        return (
                            <div key={i} className="flex flex-col items-center text-center w-20 z-10">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                                        isActive ? "bg-bni-orange text-white border-bni-orange scale-110 shadow-md" // Oranye jika aktif
                                        : isCompleted ? "bg-gray-400 text-white border-gray-400" // Abu-abu jika selesai
                                        : "bg-white text-gray-400 border-gray-200" // Putih jika belum
                                    }`}
                                >
                                    {i + 1} 
                                </div>
                                <span className={`mt-2 text-xs font-semibold ${ isActive || isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
              <motion.div 
                  key={step} 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -30 }} 
                  transition={{ duration: 0.3 }}
              >
                {step === 0 && <StepDataDiri formData={formData} handleChange={handleChange} errors={errors} />}
                {step === 1 && <StepAlamat formData={formData} handleChange={handleChange} errors={errors} />}
                {step === 2 && <StepPekerjaan formData={formData} handleChange={handleChange} errors={errors} />}
                {step === 3 && <StepPengajuan data={applicationData} formData={formData} handleChange={handleChange} errors={errors} />}
              </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-12 border-t pt-6">
            <div>
              {step > 0 && (
                <button 
                  type="button" 
                  onClick={prevStep} 
                  disabled={isLoading} 
                  className="px-6 py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Kembali
                </button>
              )}
            </div>
            <div>
              {step < steps.length - 1 ? (
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-bni-orange text-white font-semibold shadow hover:bg-orange-600 transition transform hover:scale-105"
                >
                  Berikutnya <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-bni-orange text-white font-semibold shadow hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-wait w-40 transform hover:scale-105"
                >
                  {isLoading ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : ("Kirim Pengajuan")}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function StepDataDiri({ formData, handleChange, errors }: StepProps) { return ( <StepContent title="Lengkapi Data Diri Anda"> <div className="grid md:grid-cols-2 gap-x-6 gap-y-5"> <InputField required label="Nama Lengkap Sesuai KTP" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} /> <InputField required label="Nomor Induk Kependudukan (NIK)" name="nik" value={formData.nik} onChange={handleChange} error={errors.nik} maxLength={16} /> <InputField required label="Tempat Lahir" name="birthPlace" value={formData.birthPlace} onChange={handleChange} error={errors.birthPlace} /> <InputField required label="Tanggal Lahir" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} error={errors.birthDate} /> <SelectField required label="Jenis Kelamin" name="gender" value={formData.gender} onChange={handleChange} error={errors.gender}><option value="">Pilih...</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></SelectField> <SelectField required label="Status Perkawinan" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} error={errors.maritalStatus}><option value="">Pilih...</option><option value="Belum Kawin">Belum Kawin</option><option value="Kawin">Kawin</option><option value="Cerai">Cerai</option></SelectField> <InputField required label="Nomor Telepon" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} /> <InputField required label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} /> <InputField required label="NPWP" name="npwp" value={formData.npwp} onChange={handleChange} error={errors.npwp} /> </div> </StepContent> ); }
function StepAlamat({ formData, handleChange, errors }: StepProps) { return ( <StepContent title="Informasi Alamat Tempat Tinggal"> <div className="grid md:grid-cols-2 gap-x-6 gap-y-5"> <TextAreaField required label="Alamat Sesuai KTP" name="address" value={formData.address} onChange={handleChange} error={errors.address} /> <InputField required label="Kelurahan" name="subdistrict" value={formData.subdistrict} onChange={handleChange} error={errors.subdistrict} /><InputField required label="Kecamatan" name="district" value={formData.district} onChange={handleChange} error={errors.district} /><InputField required label="Kota / Kabupaten" name="city" value={formData.city} onChange={handleChange} error={errors.city} /> <InputField required label="Provinsi" name="province" value={formData.province} onChange={handleChange} error={errors.province} /> <InputField required label="Kode Pos" name="postalCode" value={formData.postalCode} onChange={handleChange} error={errors.postalCode} maxLength={5} /> </div> </StepContent> ); }
function StepPekerjaan({ formData, handleChange, errors }: StepProps) { return ( <StepContent title="Detail Pekerjaan & Pendapatan"> <div className="grid md:grid-cols-2 gap-x-6 gap-y-5"> <InputField required label="Pekerjaan Utama" name="occupation" value={formData.occupation} onChange={handleChange} error={errors.occupation} /> <InputField required label="Nama Perusahaan / Instansi" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} /> <InputField required label="Pendapatan Bersih per Bulan (Rp)" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} error={errors.monthlyIncome} placeholder="Contoh: 10.000.000" /> <InputField required label="Lama Bekerja (Tahun)" name="workExperience" type="number" value={formData.workExperience} onChange={handleChange} error={errors.workExperience} placeholder="Contoh: 5"/> </div> </StepContent> ); }
// function StepPengajuan({ data, formData, handleChange, errors }: { data: Record<string, string | null>, formData: any, handleChange: any, errors: any }) { const houseImage = data.image || '/rumah-default.jpg'; return ( <StepContent title="Konfirmasi Detail Pengajuan & Upload Dokumen"> <div className="space-y-8"> <div> <h3 className="text-lg font-semibold text-gray-700 mb-2">Properti yang Diajukan</h3> <div className="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-xl bg-gray-50"> <div className="relative w-full md:w-40 h-32 md:h-auto md:aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0"> <Image src={houseImage} alt={data.propertiNama || "Properti"} fill className="object-cover" /> </div> <div className="text-center md:text-left"> <h4 className="font-bold text-gray-800 text-lg">{data.propertiNama || "Properti Pilihan"}</h4> {data.propertiLokasi && <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1"><MapPin size={14} /> {data.propertiLokasi}</p>} <p className="mt-2 text-xl font-bold text-bni-orange">{formatCurrency(data.hargaProperti || '0')}</p> </div> </div> </div> <div> <h3 className="text-lg font-semibold text-gray-700 mb-3">Detail Pinjaman & Dokumen</h3> <div className="grid md:grid-cols-2 gap-x-6 gap-y-5"> <InputField required label="Uang Muka (DP) (Rp)" name="downPayment" placeholder="Contoh: 150.000.000" value={formData.downPayment} onChange={handleChange} error={errors.downPayment} /> <SelectField required label="Jangka Waktu (Tenor)" name="loanTerm" value={formData.loanTerm} onChange={handleChange} error={errors.loanTerm}> <option value="">Pilih Tenor...</option><option value="10">10 Tahun</option><option value="15">15 Tahun</option><option value="20">20 Tahun</option><option value="25">25 Tahun</option><option value="30">30 Tahun</option> </SelectField> <FileInputField required label="Upload KTP (.jpg/.pdf, max 2MB)" name="fileKTP" onChange={handleChange} error={errors.fileKTP} file={formData.fileKTP}/> <FileInputField required label="Upload Slip Gaji/Bukti Penghasilan (.pdf, max 2MB)" name="fileSlipGaji" onChange={handleChange} error={errors.fileSlipGaji} file={formData.fileSlipGaji} /> </div> <div className="mt-6 space-y-3"> <label className="flex items-center gap-2.5 text-sm text-gray-600"> <input type="checkbox" name="agreePrivacy" checked={formData.agreePrivacy} onChange={handleChange} required className="h-4 w-4 rounded border-gray-300 text-bni-orange focus:ring-bni-orange accent-bni-orange"/> Saya menyetujui <Link href="/privacy" className="text-bni-teal hover:underline font-medium">kebijakan privasi dan penggunaan data pribadi</Link>* </label> {errors.agreePrivacy && <p className="mt-1 text-xs text-red-500">{errors.agreePrivacy}</p>} </div> </div> </div> </StepContent> ); }
// function StepPengajuan({
//   data,
//   formData,
//   handleChange,
//   errors,
// }: {
//   data: Record<string, string | null>;
//   formData: any;
//   handleChange: any;
//   errors: any;
// }) {
//   const [showSimulasi, setShowSimulasi] = useState(false);

//   // === Ambil data dari form ===
//   const hargaProperti = Number(data.hargaProperti || 0);
//   const downPayment = parseCurrency(formData.downPayment || "0");
//   const persenDP = hargaProperti ? Math.round((downPayment / hargaProperti) * 100) : 0;
//   const jangkaWaktu = Number(formData.loanTerm || 0);
//   const tenor = jangkaWaktu * 12;
//   const loanAmount = hargaProperti - downPayment;

//   // === Logika simulasi ===
//   const [rateSegments, setRateSegments] = useState([
//     { start: 1, end: tenor > 0 ? tenor : 240, rate: 6.5 },
//   ]);

//   const formatCurrency = (amount: number) =>
//     new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(amount);

//   // === Bangun tabel amortisasi ===
//   function buildSchedule(principal: number, segments: { start: number; end: number; rate: number }[]) {
//     const rows = [];
//     let balance = principal;

//     for (let seg of segments) {
//       const months = seg.end - seg.start + 1;
//       const r = seg.rate / 100 / 12;
//       const payment = (balance * r) / (1 - Math.pow(1 + r, -months));

//       for (let i = 0; i < months; i++) {
//         const interest = balance * r;
//         const principalPart = payment - interest;
//         balance -= principalPart;
//         rows.push({
//           month: seg.start + i,
//           rate: seg.rate,
//           payment,
//           principalPart,
//           interest,
//           balance: Math.max(0, balance),
//         });
//       }
//     }
//     return rows;
//   }

//   const rows = buildSchedule(loanAmount, rateSegments);
//   const cicilanAwal = rows[0]?.payment || 0;
//   const totalBunga = rows.reduce((sum, r) => sum + r.interest, 0);
//   const totalPembayaran = loanAmount + totalBunga;

//   // === Tampilan utama ===
//   return (
//     <StepContent title="Konfirmasi Detail Pengajuan & Upload Dokumen">
//       <div className="space-y-8">
//         {/* ==== PROPERTI ==== */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Properti yang Diajukan</h3>
//           <div className="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-xl bg-gray-50">
//             <div className="relative w-full md:w-40 h-32 md:h-auto md:aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0">
//               <Image
//                 src={data.image || "/rumah-default.jpg"}
//                 alt={data.propertiNama || "Properti"}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="text-center md:text-left">
//               <h4 className="font-bold text-gray-800 text-lg">
//                 {data.propertiNama || "Properti Pilihan"}
//               </h4>
//               {data.propertiLokasi && (
//                 <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1">
//                   <MapPin size={14} /> {data.propertiLokasi}
//                 </p>
//               )}
//               <p className="mt-2 text-xl font-bold text-bni-orange">
//                 {formatCurrency(hargaProperti)}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ==== DETAIL PINJAMAN ==== */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-3">Detail Pinjaman & Dokumen</h3>
//           <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
//             <InputField
//               required
//               label="Uang Muka (DP) (Rp)"
//               name="downPayment"
//               placeholder="Contoh: 150.000.000"
//               value={formData.downPayment}
//               onChange={handleChange}
//               error={errors.downPayment}
//             />
//             <SelectField
//               required
//               label="Jangka Waktu (Tenor)"
//               name="loanTerm"
//               value={formData.loanTerm}
//               onChange={handleChange}
//               error={errors.loanTerm}
//             >
//               <option value="">Pilih Tenor...</option>
//               <option value="10">10 Tahun</option>
//               <option value="15">15 Tahun</option>
//               <option value="20">20 Tahun</option>
//               <option value="25">25 Tahun</option>
//               <option value="30">30 Tahun</option>
//             </SelectField>

//             <FileInputField
//               required
//               label="Upload KTP (.jpg/.pdf, max 2MB)"
//               name="fileKTP"
//               onChange={handleChange}
//               error={errors.fileKTP}
//               file={formData.fileKTP}
//             />
//             <FileInputField
//               required
//               label="Upload Slip Gaji/Bukti Penghasilan (.pdf, max 2MB)"
//               name="fileSlipGaji"
//               onChange={handleChange}
//               error={errors.fileSlipGaji}
//               file={formData.fileSlipGaji}
//             />
//           </div>
//         </div>

//         {/* ==== TAB SIMULASI ==== */}
//         <div className="mt-8">
//           <button
//             type="button"
//             onClick={() => setShowSimulasi((prev) => !prev)}
//             className="w-full flex justify-between items-center bg-[#3FD8D5] text-white px-5 py-3 rounded-lg font-semibold text-left hover:bg-[#33c0ba] transition"
//           >
//             <span>💡 Simulasi Cicilan Berdasarkan Data Pengajuan</span>
//             <span>{showSimulasi ? "▲ Tutup" : "▼ Buka"}</span>
//           </button>

//           {showSimulasi && (
//             <div className="mt-5 bg-white border rounded-xl shadow-sm p-6 animate-fadeIn">
//               {hargaProperti && downPayment && jangkaWaktu ? (
//                 <>
//                   <h4 className="font-bold text-lg text-gray-800 mb-4">
//                     Hasil Simulasi KPR
//                   </h4>
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <p className="text-gray-600 text-sm">Harga Properti</p>
//                       <p className="font-semibold text-gray-900">
//                         {formatCurrency(hargaProperti)}
//                       </p>
//                       <p className="text-gray-600 text-sm mt-3">Uang Muka</p>
//                       <p className="font-semibold text-gray-900">
//                         {formatCurrency(downPayment)} ({persenDP}%)
//                       </p>
//                       <p className="text-gray-600 text-sm mt-3">Jangka Waktu</p>
//                       <p className="font-semibold text-gray-900">{jangkaWaktu} Tahun</p>
//                     </div>
//                     <div className="space-y-2 border-l pl-4">
//                       <p className="text-gray-600 text-sm">Jumlah Pinjaman</p>
//                       <p className="font-semibold text-gray-900">
//                         {formatCurrency(loanAmount)}
//                       </p>
//                       <p className="text-gray-600 text-sm mt-3">Cicilan per Bulan (estimasi)</p>
//                       <p className="text-3xl font-extrabold text-bni-orange">
//                         {formatCurrency(cicilanAwal)}
//                       </p>
//                       <p className="text-gray-600 text-sm mt-3">Total Bunga</p>
//                       <p className="font-semibold text-gray-900">
//                         {formatCurrency(totalBunga)}
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <p className="text-gray-500 italic">
//                   Lengkapi data Uang Muka dan Tenor untuk melihat simulasi cicilan.
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ==== PERSETUJUAN ==== */}
//         <div className="mt-6 space-y-3">
//           <label className="flex items-center gap-2.5 text-sm text-gray-600">
//             <input
//               type="checkbox"
//               name="agreePrivacy"
//               checked={formData.agreePrivacy}
//               onChange={handleChange}
//               required
//               className="h-4 w-4 rounded border-gray-300 text-bni-orange focus:ring-bni-orange accent-bni-orange"
//             />
//             Saya menyetujui{" "}
//             <Link
//               href="/privacy"
//               className="text-bni-teal hover:underline font-medium"
//             >
//               kebijakan privasi dan penggunaan data pribadi
//             </Link>
//             *
//           </label>
//           {errors.agreePrivacy && (
//             <p className="mt-1 text-xs text-red-500">{errors.agreePrivacy}</p>
//           )}
//         </div>
//       </div>
//     </StepContent>
//   );
// }
function StepPengajuan({
  data,
  formData,
  handleChange,
  errors,
}: {
  data: Record<string, string | null>;
  formData: any;
  handleChange: any;
  errors: any;
}) {
  const [showSimulasi, setShowSimulasi] = useState(false);

  // === Ambil data utama dari form ===
  const hargaProperti = Number(data.hargaProperti || 0);
  const downPayment = parseCurrency(formData.downPayment || "0");
  const persenDP = hargaProperti ? Math.round((downPayment / hargaProperti) * 100) : 0;
  const jangkaWaktu = Number(formData.loanTerm || 0);
  const tenor = jangkaWaktu * 12;
  const loanAmount = hargaProperti - downPayment;

  // === State simulasi interaktif tambahan ===
  const [hargaSlider, setHargaSlider] = useState(hargaProperti || 500000000);
  const [persenDPslider, setPersenDPslider] = useState(persenDP || 20);
  const [sukuBunga, setSukuBunga] = useState(6.5);
  const [jangkaWaktuSlider, setJangkaWaktuSlider] = useState(jangkaWaktu || 15);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const formatCurrencyLocal = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  // === Build tabel amortisasi ===
  const buildSchedule = (P: number, months: number, rateAnnual: number) => {
    const r = rateAnnual / 100 / 12;
    if (P <= 0 || months <= 0) return [];
    const pay = r === 0 ? P / months : (P * r) / (1 - Math.pow(1 + r, -months));
    let balance = P;
    const rows = [];
    for (let i = 1; i <= months; i++) {
      const interest = balance * r;
      const principal = pay - interest;
      balance -= principal;
      rows.push({
        month: i,
        principalComponent: principal,
        interestComponent: interest,
        payment: pay,
        balance: Math.max(0, balance),
      });
    }
    return rows;
  };

  const jumlahPinjaman = hargaSlider - hargaSlider * (persenDPslider / 100);
  const tenorBulan = jangkaWaktuSlider * 12;
  const rows = buildSchedule(jumlahPinjaman, tenorBulan, sukuBunga);
  const cicilanPerBulan = rows[0]?.payment || 0;
  const totalBunga = rows.reduce((sum, r) => sum + r.interestComponent, 0);
  const totalPembayaran = rows.reduce((sum, r) => sum + r.payment, 0);
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const maxPage = Math.ceil(rows.length / pageSize);

  return (
    <StepContent title="Konfirmasi Detail Pengajuan & Upload Dokumen">
      <div className="space-y-8">
        {/* ==== PROPERTI ==== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Properti yang Diajukan</h3>
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-xl bg-gray-50">
            <div className="relative w-full md:w-40 h-32 md:h-auto md:aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={data.image || "/rumah-default.jpg"}
                alt={data.propertiNama || "Properti"}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-bold text-gray-800 text-lg">
                {data.propertiNama || "Properti Pilihan"}
              </h4>
              {data.propertiLokasi && (
                <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1">
                  <MapPin size={14} /> {data.propertiLokasi}
                </p>
              )}
              <p className="mt-2 text-xl font-bold text-bni-orange">
                {formatCurrency(hargaProperti)}
              </p>
            </div>
          </div>
        </div>

        {/* ==== DETAIL PINJAMAN ==== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Detail Pinjaman & Dokumen</h3>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
            <InputField
              required
              label="Uang Muka (DP) (Rp)"
              name="downPayment"
              placeholder="Contoh: 150.000.000"
              value={formData.downPayment}
              onChange={handleChange}
              error={errors.downPayment}
            />
            <SelectField
              required
              label="Jangka Waktu (Tenor)"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleChange}
              error={errors.loanTerm}
            >
              <option value="">Pilih Tenor...</option>
              <option value="10">10 Tahun</option>
              <option value="15">15 Tahun</option>
              <option value="20">20 Tahun</option>
              <option value="25">25 Tahun</option>
              <option value="30">30 Tahun</option>
            </SelectField>

            <FileInputField
              required
              label="Upload KTP (.jpg/.pdf, max 2MB)"
              name="fileKTP"
              onChange={handleChange}
              error={errors.fileKTP}
              file={formData.fileKTP}
            />
            <FileInputField
              required
              label="Upload Slip Gaji/Bukti Penghasilan (.pdf, max 2MB)"
              name="fileSlipGaji"
              onChange={handleChange}
              error={errors.fileSlipGaji}
              file={formData.fileSlipGaji}
            />
          </div>
        </div>

        {/* ==== SIMULASI SLIDER DAN TABEL ==== */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowSimulasi((prev) => !prev)}
            className="w-full flex justify-between items-center bg-[#3FD8D5] text-white px-5 py-3 rounded-lg font-semibold text-left hover:bg-[#33c0ba] transition"
          >
            <span>💡 Simulasi Cicilan Interaktif</span>
            <span>{showSimulasi ? "▲ Tutup" : "▼ Buka"}</span>
          </button>

          {showSimulasi && (
            <div className="mt-6 bg-white border rounded-xl shadow-sm p-6 animate-fadeIn">
              {/* SLIDER INPUT */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Harga Properti
                  </label>
                  <input
                    type="range"
                    min={100000000}
                    max={5000000000}
                    step={10000000}
                    value={hargaSlider}
                    onChange={(e) => setHargaSlider(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-right font-medium">{formatCurrencyLocal(hargaSlider)}</p>

                  <label className="block text-sm font-semibold text-gray-700">
                    Uang Muka (DP)
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    step={5}
                    value={persenDPslider}
                    onChange={(e) => setPersenDPslider(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-right font-medium">
                    {persenDPslider}% ({formatCurrencyLocal(hargaSlider * (persenDPslider / 100))})
                  </p>

                  <label className="block text-sm font-semibold text-gray-700">
                    Suku Bunga (% per tahun)
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={15}
                    step={0.25}
                    value={sukuBunga}
                    onChange={(e) => setSukuBunga(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-right font-medium">{sukuBunga.toFixed(2)}%</p>

                  <label className="block text-sm font-semibold text-gray-700">
                    Jangka Waktu (Tahun)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={jangkaWaktuSlider}
                    onChange={(e) => setJangkaWaktuSlider(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-right font-medium">{jangkaWaktuSlider} tahun</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Hasil Simulasi</h4>
                  <p className="text-gray-600 text-sm">Cicilan per Bulan</p>
                  <p className="text-3xl font-extrabold text-bni-orange">
                    {formatCurrencyLocal(cicilanPerBulan)}
                  </p>
                  <div className="mt-4 space-y-1 text-sm">
                    <p>Jumlah Pinjaman: <span className="font-semibold">{formatCurrencyLocal(jumlahPinjaman)}</span></p>
                    <p>Total Bunga: <span className="font-semibold">{formatCurrencyLocal(totalBunga)}</span></p>
                    <p>Total Pembayaran: <span className="font-semibold">{formatCurrencyLocal(totalPembayaran)}</span></p>
                  </div>
                </div>
              </div>

              <section className="mt-10">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Rincian Tabel Angsuran</h4>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-600">Bulan Ke-</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Angsuran Pokok</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Angsuran Bunga</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Total Angsuran</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Sisa Pinjaman</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedRows.map((row) => (
                        <tr key={row.month} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">{row.month}</td>
                          <td className="px-4 py-3 text-gray-700">{formatCurrencyLocal(row.principalComponent)}</td>
                          <td className="px-4 py-3 text-gray-700">{formatCurrencyLocal(row.interestComponent)}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrencyLocal(row.payment)}</td>
                          <td className="px-4 py-3 text-gray-700">{formatCurrencyLocal(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {rows.length > 0 && (
                  <div className="flex justify-between items-center mt-6 text-sm">
                    <span className="text-gray-600">
                      Menampilkan {pagedRows.length} dari {rows.length} baris
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 rounded-lg border bg-white font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Sebelumnya
                      </button>
                      <button
                        disabled={page === maxPage}
                        onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                        className="px-4 py-2 rounded-lg border bg-white font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Berikutnya
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        {/* ==== PERSETUJUAN ==== */}
        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-2.5 text-sm text-gray-600">
            <input
              type="checkbox"
              name="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleChange}
              required
              className="h-4 w-4 rounded border-gray-300 text-bni-orange focus:ring-bni-orange accent-bni-orange"
            />
            Saya menyetujui{" "}
            <Link
              href="/privacy"
              className="text-bni-teal hover:underline font-medium"
            >
              kebijakan privasi dan penggunaan data pribadi
            </Link>
            *
          </label>
          {errors.agreePrivacy && (
            <p className="mt-1 text-xs text-red-500">{errors.agreePrivacy}</p>
          )}
        </div>
      </div>
    </StepContent>
  );
}
