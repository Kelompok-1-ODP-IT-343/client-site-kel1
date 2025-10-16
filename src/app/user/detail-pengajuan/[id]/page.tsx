"use client";
import { useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { allHouses } from '@/app/lib/propertyData';

// Helper untuk format Rupiah
const formatCurrency = (amount: number | string) => {
  const num = Number(amount);
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};

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
    <main className="flex-grow py-10">
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-3xl shadow-lg border">
        <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-10">Formulir Pengajuan KPR</h1>
        <div className="flex justify-center items-center gap-4 mb-10 overflow-x-auto pb-4">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition ${ i === step ? "bg-bni-orange text-white shadow-md" : i < step ? "bg-bni-teal text-white" : "bg-gray-200 text-gray-600" }`}>
                {i < step ? <CheckCircle size={18} /> : i + 1}
              </div>
              <span className={`ml-3 text-sm font-medium hidden sm:inline ${i === step ? "text-bni-teal" : "text-gray-500"}`}>{label}</span>
              {i < steps.length - 1 && (<div className="ml-4 w-8 h-[2px] bg-gray-300 hidden sm:block"></div>)}
            </div>
          ))}
        </div>
        <div className="transition-all duration-300 ease-in-out">
          {step === 0 && <DataDiri />}
          {step === 1 && <Alamat />}
          {step === 2 && <Pekerjaan />}
          {step === 3 && <Pengajuan data={applicationData} />}
        </div>
        <div className="flex justify-between items-center mt-10">
          <div>{step > 0 && (<button onClick={prevStep} disabled={isLoading} className="px-5 py-2.5 rounded-xl border font-semibold text-bni-teal hover:bg-gray-50 disabled:opacity-50">Kembali</button>)}</div>
          <div>{step < steps.length - 1 ? (<button onClick={nextStep} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-bni-teal text-white font-semibold hover:scale-[1.02] transition">Berikutnya <ArrowRight size={18} /></button>) : (<button onClick={handleSubmit} disabled={isLoading} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-bni-orange text-white font-semibold hover:scale-[1.02] transition disabled:bg-gray-400 disabled:cursor-wait w-32">{isLoading ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : ("Kirim")}</button>)}</div>
        </div>
      </div>
    </main>
  );
}

// === Step Components ===
function InputField({ label, placeholder, value, readOnly }: { label:string; placeholder?:string; value?:string; readOnly?:boolean }) { return ( <div className="flex flex-col"><label className="text-sm font-semibold text-gray-700 mb-1">{label}</label><input type="text" placeholder={placeholder} defaultValue={value} readOnly={readOnly} className={`rounded-xl border border-gray-300 focus:border-bni-teal focus:ring-2 focus:ring-bni-teal/50 px-4 py-2 outline-none transition ${readOnly ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}`} /></div> ); }
function DataDiri() { return <div className="grid md:grid-cols-2 gap-5"><InputField label="Nama Lengkap" /><InputField label="NIK" /><InputField label="Tempat Lahir" /><InputField label="Tanggal Lahir" /><InputField label="Jenis Kelamin" /><InputField label="Status Perkawinan" /></div>; }
function Alamat() { return <div className="grid md:grid-cols-2 gap-5"><InputField label="Alamat Sesuai KTP" /><InputField label="Kota" /><InputField label="Provinsi" /><InputField label="Kode Pos" /></div>; }
function Pekerjaan() { return <div className="grid md:grid-cols-2 gap-5"><InputField label="Pekerjaan" /><InputField label="Pendapatan per Bulan" /><InputField label="Nama Perusahaan" /><InputField label="NPWP" /></div>; }

function Pengajuan({ data }: { data: Record<string, string | null> }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="flex flex-col items-center p-4 border rounded-xl bg-gray-50">
        <Image src={data.propertiId ? allHouses.find(h => h.id === Number(data.propertiId))?.image || '/rumah-1.jpg' : '/rumah-1.jpg'} alt={data.propertiNama || "Properti"} width={300} height={180} className="rounded-xl shadow-sm mb-3 object-cover" />
        <div className="text-center">
          <h3 className="font-semibold text-gray-800">{data.propertiNama || "Properti Pilihan"}</h3>
          {data.propertiLokasi && <p className="text-sm text-gray-500 flex items-center justify-center gap-1"><MapPin size={14} /> {data.propertiLokasi}</p>}
          <p className="mt-1 text-xl font-bold text-bni-orange">{formatCurrency(data.hargaProperti || '0')}</p>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Isi Detail Pengajuan</h3>
        <InputField label="Uang Muka (DP)" placeholder="Contoh: 150000000" />
        <InputField label="Jangka Waktu (Tahun)" placeholder="Contoh: 15" />
      </div>
    </div>
  );
}