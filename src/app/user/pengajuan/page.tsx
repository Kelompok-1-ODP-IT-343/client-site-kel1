// pengajuan

"use client";
import { useState } from "react";
import Image from "next/image";
import { MapPin, ArrowRight, CheckCircle } from "lucide-react";

const COLORS = { orange: "#FF8500", teal: "#0f766e", gray: "#757575", lime: "#DDEE59" };

export default function FormPengajuan() {
  const steps = ["Data Diri", "Alamat", "Pekerjaan", "Pengajuan"];
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Image src="/logo-satuatap.png" alt="Logo" width={36} height={36} />
            <span className="font-extrabold text-xl text-[#FF8500]">satuatap</span>
          </div>
          <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
            <a href="/" className="hover:text-[#0f766e]">Beranda</a>
            <a href="/cari-rumah" className="hover:text-[#0f766e]">Cari Rumah</a>
            <a href="/simulasi" className="hover:text-[#0f766e]">Simulasi</a>
          </nav>
          <button className="px-4 py-2 rounded-full text-white text-sm shadow-md bg-[#0f766e] hover:opacity-90 transition">
            Login
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto p-8 mt-10 bg-white rounded-3xl shadow-sm">
          <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-10">
            Formulir Pengajuan KPR
          </h1>

          {/* Stepper */}
          <div className="flex justify-center items-center gap-4 mb-10">
            {steps.map((label, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition ${
                    i === step
                      ? "bg-[#FF8500] text-white shadow-md"
                      : i < step
                      ? "bg-[#0f766e] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i < step ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    i === step ? "text-[#0f766e]" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
                {i < steps.length - 1 && (
                  <div className="mx-3 w-8 h-[2px] bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="transition-all duration-300 ease-in-out">
            {step === 0 && <DataDiri />}
            {step === 1 && <Alamat />}
            {step === 2 && <Pekerjaan />}
            {step === 3 && <Pengajuan />}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            {step > 0 && (
              <button
                onClick={prevStep}
                className="px-5 py-2 rounded-xl border text-[#0f766e] hover:bg-gray-50"
              >
                Kembali
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="ml-auto flex items-center gap-2 px-6 py-2 rounded-xl bg-[#0f766e] text-white font-semibold hover:scale-[1.02] transition"
              >
                Berikutnya <ArrowRight size={18} />
              </button>
            ) : (
              <button
                className="ml-auto flex items-center gap-2 px-6 py-2 rounded-xl bg-[#FF8500] text-white font-semibold hover:scale-[1.02] transition"
              >
                Kirim
              </button>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-10 text-white" style={{ background: COLORS.orange }}>
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          <div className="text-sm leading-relaxed">
            <p>
              PT Bank Negara Indonesia (Persero) Tbk adalah bank BUMN terbesar di Indonesia.
              Kami berkomitmen memberikan layanan KPR terbaik untuk mewujudkan impian rumah Anda.
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Layanan</h5>
            <ul className="space-y-1 text-sm">
              <li>Pengajuan</li>
              <li>Simulasi</li>
              <li>Cari Rumah</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Hubungi Kami</h5>
            <ul className="space-y-1 text-sm">
              <li>📞 1500046</li>
              <li>✉️ kpr@bni.co.id</li>
              <li>🏢 Jl. Jenderal Sudirman Kav. 1 Jakarta Pusat 10220</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =============================
   Step Components
============================= */
function InputField({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="rounded-xl border border-gray-300 focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e] px-4 py-2 outline-none transition"
      />
    </div>
  );
}

function DataDiri() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <InputField label="Nama Lengkap" />
      <InputField label="NIK" />
      <InputField label="Tempat Lahir" />
      <InputField label="Tanggal Lahir" />
      <InputField label="Jenis Kelamin" />
      <InputField label="Status" />
    </div>
  );
}

function Alamat() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <InputField label="Alamat" />
      <InputField label="Kota" />
      <InputField label="Provinsi" />
      <InputField label="Kode Pos" />
    </div>
  );
}

function Pekerjaan() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <InputField label="Pekerjaan" />
      <InputField label="Gaji" />
      <InputField label="Perusahaan" />
      <InputField label="NPWP" />
    </div>
  );
}

function Pengajuan() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="flex flex-col items-center">
        <Image
          src="/rumah-1.png"
          alt="Cluster"
          width={300}
          height={180}
          className="rounded-xl shadow-sm mb-3"
        />
        <div className="text-center">
          <h3 className="font-semibold text-gray-800">Cluster Green Valley</h3>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <MapPin size={14} /> Serpong, Banten
          </p>
          <p className="mt-1 font-bold text-gray-800">Rp 1.500.000</p>
        </div>
      </div>
      <div>
        <InputField label="Uang Muka" />
        <InputField label="Tenor" />
      </div>
    </div>
  );
}
