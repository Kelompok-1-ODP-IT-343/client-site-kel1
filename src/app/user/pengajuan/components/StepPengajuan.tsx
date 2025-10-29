"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import StepContent from "./StepContent";
import InputField from "../fields/InputField";
import SelectField from "../fields/SelectField";
import FileInputField from "../fields/FileInputField";
import TermsContent from "./TermsContent";
import { formatCurrency, parseCurrency } from "../utils/format";

export default function StepPengajuan({ data, formData, handleChange, errors }: any) {
  const [showSimulasi, setShowSimulasi] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const hargaProperti = Number(data.hargaProperti || 0);
  const downPayment = parseCurrency(formData.downPayment || "0");
  const persenDP = hargaProperti ? Math.round((downPayment / hargaProperti) * 100) : 0;
  const jangkaWaktu = Number(formData.loanTerm || 0);

  const loanAmount = hargaProperti - downPayment;

  const [developerType, setDeveloperType] = useState<"A" | "B">("A");
  const [schemeType, setSchemeType] = useState<"single_fixed" | "tiered">("single_fixed");
  const [loanTerm, setLoanTerm] = useState(jangkaWaktu || 15);

  const buildSchedule = (P: number, months: number, rateAnnual: number) => {
    const r = rateAnnual / 100 / 12;
    if (P <= 0 || months <= 0) return [];

    const pay = (P * r) / (1 - Math.pow(1 + r, -months));
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
        rateApplied: r,
      });
    }

    return rows;
  };

  const tenorBulan = loanTerm * 12;
  const rows = buildSchedule(loanAmount, tenorBulan, 6.5);
  const cicilanPerBulan = rows[0]?.payment || 0;
  const totalBunga = rows.reduce((sum: number, r: any) => sum + r.interestComponent, 0);
  const totalPembayaran = rows.reduce((sum: number, r: any) => sum + r.payment, 0);

  return (
    <StepContent title="Konfirmasi Detail Pengajuan & Upload Dokumen">
      <div className="space-y-8">

        {/* ===== Properti Diajukan ===== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Properti yang Diajukan</h3>

          <div className="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-xl bg-gray-50">
            <div className="relative w-full md:w-40 h-32 md:aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={data.image || "/rumah-default.jpg"}
                alt={data.propertiNama || "Properti"}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-bold text-gray-800 text-lg">{data.propertiNama}</h4>

              <p className="text-sm text-gray-500 flex justify-center md:justify-start gap-1">
                <MapPin size={14} /> {data.propertiLokasi}
              </p>

              <p className="mt-2 text-xl font-bold text-bni-orange">
                {formatCurrency(hargaProperti)}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Detail Pinjaman ===== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Detail Pinjaman & Dokumen</h3>

          <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
            <InputField required label="Uang Muka (DP) (Rp)" name="downPayment" placeholder="Contoh: 150.000.000" value={formData.downPayment} onChange={handleChange} error={errors.downPayment} />

            <SelectField required label="Jangka Waktu (Tenor)" name="loanTerm" value={formData.loanTerm} onChange={handleChange} error={errors.loanTerm}>
              <option value="">Pilih Tenor...</option>
              {[10, 15, 20, 25, 30].map((y) => (
                <option key={y} value={y}>{y} Tahun</option>
              ))}
            </SelectField>

            <FileInputField required label="Upload KTP (.jpg/.pdf, max 2MB)" name="fileKTP" file={formData.fileKTP} onChange={handleChange} error={errors.fileKTP} />
            <FileInputField required label="Upload Slip Gaji (.pdf, max 2MB)" name="fileSlipGaji" file={formData.fileSlipGaji} onChange={handleChange} error={errors.fileSlipGaji} />
          </div>
        </div>

        {/* ===== Simulasi ===== */}
        <div className="space-y-3 border-t pt-4">
          <button
            type="button"
            onClick={() => setShowSimulasi(!showSimulasi)}
            className="mt-3 flex items-center gap-2 text-bni-orange font-semibold"
          >
            {showSimulasi ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {showSimulasi ? "Tutup Simulasi KPR" : "Lihat Simulasi KPR"}
          </button>

          {showSimulasi && (
            <div className="animate-fadeIn border rounded-xl p-5 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700 flex gap-2 mb-4">
                <Settings2 size={18} /> Simulasi Multi-Rate
              </h3>

              <div className="bg-white border rounded-lg p-4 mb-4">
                <p className="text-gray-600 text-sm">Estimasi Cicilan Pertama</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(cicilanPerBulan)}</p>

                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <p>Jumlah Pinjaman: <span className="font-semibold">{formatCurrency(loanAmount)}</span></p>
                  <p>Total Bunga: <span className="font-semibold">{formatCurrency(totalBunga)}</span></p>
                  <p>Total Pembayaran: <span className="font-semibold">{formatCurrency(totalPembayaran)}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== Persetujuan Terms ===== */}
        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms}
            onChange={(e) => handleChange(e)}
            className="h-4 w-4 rounded border-gray-300 text-bni-orange focus:ring-bni-orange mt-1"
          />

          <span>
            Saya setuju dengan{" "}
            <button type="button" onClick={() => setShowTerms(true)} className="text-bni-orange underline font-medium">
              Syarat & Ketentuan
            </button>
          </span>
        </label>

        {errors.agreeTerms && (
          <p className="text-xs text-red-500">{errors.agreeTerms}</p>
        )}

        {/* ===== Modal Terms ===== */}
        {showTerms && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
              <button
                onClick={() => setShowTerms(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-base font-semibold mb-3">
                Syarat & Ketentuan
              </h2>

              <div className="mt-2">
                <TermsContent />
              </div>


              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    handleChange({ target: { name: "agreeTerms", type: "checkbox", checked: true } });
                    setShowTerms(false);
                  }}
                  className="bg-bni-orange text-white text-sm px-4 py-2 rounded-md"
                >
                  Saya Setuju
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepContent>
  );
}
