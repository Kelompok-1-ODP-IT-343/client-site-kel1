// src/app/user/pengajuan/page.tsx

"use client";
import { useState, ReactNode } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { allHouses } from '@/app/lib/propertyData'; // Pastikan path ini benar

// Helper untuk format Rupiah
const formatCurrency = (amount: number | string) => {
  const num = Number(amount);
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};

// ============================================================================
// KOMPONEN UTAMA
// ============================================================================
export default function FormPengajuanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const steps = ["Data Diri", "Alamat", "Pekerjaan", "Pengajuan"];
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const applicationData = {
    propertiId: searchParams.get('propertiId'),
    propertiNama: searchParams.get('propertiNama'),
    propertiLokasi: searchParams.get('propertiLokasi'),
    hargaProperti: searchParams.get('hargaProperti') || '0',
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newApplicationId = 9; // Simulasi ID
    router.push(`/user/pengajuan/${newApplicationId}`);
  };

  return (
    <main className="flex-grow py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border">
        <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-4">Formulir Pengajuan KPR</h1>
        <p className="text-center text-gray-500 mb-10">Lengkapi data di bawah ini untuk melanjutkan proses pengajuan Anda.</p>
        
        <div className="w-full px-4 sm:px-0 mb-12">
            <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-bni-teal transition-all duration-500 -translate-y-1/2"
                    style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                ></div>
                
                <div className="flex justify-between items-center relative">
                    {steps.map((label, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                                i <= step ? "border-bni-teal" : "border-gray-200"
                            } ${
                                i === step
                                ? "bg-bni-orange text-white scale-110 shadow-md"
                                : i < step
                                ? "bg-bni-teal text-white"
                                : "bg-white text-gray-500"
                            }`}
                        >
                            {i < step ? <CheckCircle size={20} /> : i + 1}
                        </div>
                        <span className={`mt-2 text-xs font-semibold ${ i <= step ? "text-gray-800" : "text-gray-400"}`}>
                            {label}
                        </span>
                    </div>
                    ))}
                </div>
            </div>
        </div>


        <div className="mt-10 transition-all duration-300 ease-in-out">
          {step === 0 && <StepContent title="Lengkapi Data Diri Anda"><DataDiri /></StepContent>}
          {step === 1 && <StepContent title="Informasi Alamat Tempat Tinggal"><Alamat /></StepContent>}
          {step === 2 && <StepContent title="Detail Pekerjaan & Pendapatan"><Pekerjaan /></StepContent>}
          {step === 3 && <StepContent title="Konfirmasi Detail Pengajuan"><Pengajuan data={applicationData} /></StepContent>}
        </div>

        <div className="flex justify-between items-center mt-12 border-t pt-6">
          <div>
            {step > 0 && (
              <button onClick={prevStep} disabled={isLoading} className="px-5 py-2.5 rounded-lg border font-semibold text-bni-teal hover:bg-gray-50 disabled:opacity-50">
                Kembali
              </button>
            )}
          </div>
          <div>
            {step < steps.length - 1 ? (
              // <-- PERUBAHAN #1 DI SINI: Tombol "Berikutnya" menjadi oranye
              <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-bni-orange text-white font-semibold shadow hover:bg-orange-600 transition transform hover:scale-105">
                Berikutnya <ArrowRight size={18} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isLoading} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-bni-orange text-white font-semibold shadow hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-wait w-36 transform hover:scale-105">
                {isLoading ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : ("Kirim Pengajuan")}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// =============================
// Step & Helper Components
// =============================

const StepContent = ({ title, children }: { title: string; children: ReactNode }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        {children}
    </div>
);

function InputField({ label, placeholder, value, readOnly }: { label:string; placeholder?:string; value?:string; readOnly?:boolean }) { 
    return ( 
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
            {/* <-- PERUBAHAN #2 DI SINI: Menambahkan `text-gray-900` untuk warna teks input */}
            <input type="text" placeholder={placeholder} defaultValue={value} readOnly={readOnly} className={`rounded-lg border border-gray-300 text-gray-900 focus:border-bni-teal focus:ring-1 focus:ring-bni-teal px-4 py-2.5 outline-none transition ${readOnly ? 'bg-gray-100 text-gray-500' : ''}`} />
        </div> 
    ); 
}

function DataDiri() { return <div className="grid md:grid-cols-2 gap-x-6 gap-y-5"><InputField label="Nama Lengkap Sesuai KTP" /><InputField label="Nomor Induk Kependudukan (NIK)" /><InputField label="Tempat Lahir" /><InputField label="Tanggal Lahir (DD/MM/YYYY)" /><InputField label="Jenis Kelamin" /><InputField label="Status Perkawinan" /></div>; }
function Alamat() { return <div className="grid md:grid-cols-2 gap-x-6 gap-y-5"><InputField label="Alamat Sesuai KTP" /><InputField label="Kota / Kabupaten" /><InputField label="Provinsi" /><InputField label="Kode Pos" /></div>; }
function Pekerjaan() { return <div className="grid md:grid-cols-2 gap-x-6 gap-y-5"><InputField label="Pekerjaan Utama" /><InputField label="Pendapatan Bersih per Bulan" /><InputField label="Nama Perusahaan / Instansi" /><InputField label="Nomor Pokok Wajib Pajak (NPWP)" /></div>; }

function Pengajuan({ data }: { data: Record<string, string | null> }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Properti yang Diajukan</h3>
        <div className="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-xl bg-gray-50">
          <Image 
            src={data.propertiId ? allHouses.find(h => h.id === Number(data.propertiId))?.image || '/rumah-1.jpg' : '/rumah-1.jpg'} 
            alt={data.propertiNama || "Properti"}
            width={160} height={120} 
            className="rounded-lg shadow-sm object-cover w-full md:w-40" 
          />
          <div className="text-center md:text-left">
            <h4 className="font-bold text-gray-800 text-lg">{data.propertiNama || "Properti Pilihan"}</h4>
            {data.propertiLokasi && <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1"><MapPin size={14} /> {data.propertiLokasi}</p>}
            <p className="mt-2 text-xl font-bold text-bni-orange">{formatCurrency(data.hargaProperti || '0')}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Detail Pinjaman</h3>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
            <InputField label="Uang Muka (DP)" placeholder="Contoh: 150000000" />
            <InputField label="Jangka Waktu (Tahun)" placeholder="Contoh: 15" />
        </div>
      </div>
    </div>
  );
}