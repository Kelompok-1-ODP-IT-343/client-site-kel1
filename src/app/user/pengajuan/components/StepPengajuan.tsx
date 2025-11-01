"use client";

import { useMemo, useState } from "react";
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

  // ===== Tenor & Paket KPR data (Top Selected Developer) =====
  const TENOR_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30];

  // Map available package names by tenor (based on the provided table)
  const PACKAGES_BY_TENOR: Record<number, string[]> = {
    1: ["fixed_1y"],
    2: ["fixed_2y"],
    3: ["fixed_1y", "fixed_3y"],
    4: ["fixed_4y"],
    5: ["fixed_3y", "fixed_5y"],
    6: ["fixed_6y"],
    7: ["fixed_7y"],
    8: ["fixed_8y"],
    9: ["fixed_9y"],
    10: ["fixed_3y", "fixed_5y", "fixed_10y", "tiered_10y"],
    12: ["fixed_5y"],
    15: ["fixed_3y", "fixed_5y", "tiered_15y"],
    20: ["fixed_3y", "fixed_5y", "fixed_10y", "tiered_20y"],
    25: ["fixed_3y", "fixed_5y", "fixed_10y", "tiered_25y"],
    30: ["fixed_3y", "fixed_5y", "fixed_10y", "tiered_30y"],
  };

  type RateEntry = {
    id: number; // numeric KPR plan id expected by backend
    developerCategory: "Top Selected Developer";
    name:
      | "fixed_1y" | "fixed_2y" | "fixed_3y" | "fixed_4y" | "fixed_5y" | "fixed_6y" | "fixed_7y" | "fixed_8y" | "fixed_9y" | "fixed_10y"
      | "tiered_10y" | "tiered_15y" | "tiered_20y" | "tiered_25y" | "tiered_30y";
    tenor: number;
    rateType: "fixed" | "tiered";
    rates: Array<number | "Floating" | "—">; // per year sequence
  };

  // Note: Using only "Top Selected Developer" rows from the table you provided
  const RATE_TABLE: RateEntry[] = [
    { id: 1, developerCategory: "Top Selected Developer", name: "fixed_1y", tenor: 1, rateType: "fixed", rates: [7.75] },
    { id: 2, developerCategory: "Top Selected Developer", name: "fixed_2y", tenor: 2, rateType: "fixed", rates: [7.75, 7.75] },
    { id: 3, developerCategory: "Top Selected Developer", name: "fixed_1y", tenor: 3, rateType: "fixed", rates: [2.75, "Floating", "Floating"] },
    { id: 4, developerCategory: "Top Selected Developer", name: "fixed_3y", tenor: 3, rateType: "fixed", rates: [7.75, 7.75, 7.75] },
    { id: 5, developerCategory: "Top Selected Developer", name: "fixed_4y", tenor: 4, rateType: "fixed", rates: [8, 8, 8, 8] },
    { id: 6, developerCategory: "Top Selected Developer", name: "fixed_3y", tenor: 5, rateType: "fixed", rates: [6.75, 6.75, 6.75, "Floating", "Floating"] },
    { id: 7, developerCategory: "Top Selected Developer", name: "fixed_5y", tenor: 5, rateType: "fixed", rates: [8, 8, 8, 8, 8] },
    { id: 8, developerCategory: "Top Selected Developer", name: "fixed_6y", tenor: 6, rateType: "fixed", rates: [8, 8, 8, 8, 8, 8] },
    { id: 9, developerCategory: "Top Selected Developer", name: "fixed_7y", tenor: 7, rateType: "fixed", rates: [8, 8, 8, 8, 8, 8, 8] },
    { id: 10, developerCategory: "Top Selected Developer", name: "fixed_8y", tenor: 8, rateType: "fixed", rates: [8, 8, 8, 8, 8, 8, 8, 8] },
    { id: 11, developerCategory: "Top Selected Developer", name: "fixed_9y", tenor: 9, rateType: "fixed", rates: [8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25] },
    { id: 12, developerCategory: "Top Selected Developer", name: "fixed_3y", tenor: 10, rateType: "fixed", rates: [3.75, 3.75, 3.75, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 13, developerCategory: "Top Selected Developer", name: "fixed_5y", tenor: 10, rateType: "fixed", rates: [5.75, 5.75, 5.75, 5.75, 5.75, "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 14, developerCategory: "Top Selected Developer", name: "fixed_10y", tenor: 10, rateType: "fixed", rates: [8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25, 8.25] },
    { id: 53, developerCategory: "Top Selected Developer", name: "tiered_10y", tenor: 10, rateType: "tiered", rates: [2.75, 4.75, 6.75, 8.75, 10.75, 10.75, 10.75, 10.75, 10.75, 10.75] },
    { id: 15, developerCategory: "Top Selected Developer", name: "fixed_5y", tenor: 12, rateType: "fixed", rates: [4.75, 4.75, 4.75, 4.75, 4.75, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 16, developerCategory: "Top Selected Developer", name: "fixed_3y", tenor: 15, rateType: "fixed", rates: [2.75, 2.75, 2.75, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 17, developerCategory: "Top Selected Developer", name: "fixed_5y", tenor: 15, rateType: "fixed", rates: [3.75, 3.75, 3.75, 3.75, 3.75, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 54, developerCategory: "Top Selected Developer", name: "tiered_15y", tenor: 15, rateType: "tiered", rates: [2.75, 4.75, 4.75, 6.75, 6.75, 8.75, 8.75, 10.75, 10.75, 10.75, "—", "—", "—", "—", "—"] },
    { id: 18, developerCategory: "Top Selected Developer", name: "fixed_3y", tenor: 20, rateType: "fixed", rates: [4, 4, 4, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 19, developerCategory: "Top Selected Developer", name: "fixed_5y", tenor: 20, rateType: "fixed", rates: [6, 6, 6, 6, 6, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 20, developerCategory: "Top Selected Developer", name: "fixed_10y", tenor: 20, rateType: "fixed", rates: [8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 55, developerCategory: "Top Selected Developer", name: "tiered_20y", tenor: 20, rateType: "tiered", rates: [3, 5, 5, 7, 7, 9, 9, 9, 9, 9, 10.5, 10.5, 10.5, 10.5, 10.5, 11, 11, 11, 11, 11] },
    { id: 21, developerCategory: "Top Selected Developer", name: "fixed_3y", tenor: 25, rateType: "fixed", rates: [4.25, 4.25, 4.25, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 22, developerCategory: "Top Selected Developer", name: "fixed_5y", tenor: 25, rateType: "fixed", rates: [6.25, 6.25, 6.25, 6.25, 6.25, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 23, developerCategory: "Top Selected Developer", name: "fixed_10y", tenor: 25, rateType: "fixed", rates: [8.75, 8.75, 8.75, 8.75, 8.75, 8.75, 8.75, 8.75, 8.75, 8.75, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 56, developerCategory: "Top Selected Developer", name: "tiered_25y", tenor: 25, rateType: "tiered", rates: [3.25, 5.25, 5.25, 7.25, 7.25, 9.25, 9.25, 9.25, 9.25, 9.25, 10.75, 10.75, 10.75, 10.75, 10.75, 11.25, 11.25, 11.25, 11.25, 11.25, 11.75, 11.75, 11.75, 11.75, 11.75] },
    { id: 24, developerCategory: "Top Selected Developer", name: "fixed_3y", tenor: 30, rateType: "fixed", rates: [4.5, 4.5, 4.5, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 25, developerCategory: "Top Selected Developer", name: "fixed_5y", tenor: 30, rateType: "fixed", rates: [6.5, 6.5, 6.5, 6.5, 6.5, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 26, developerCategory: "Top Selected Developer", name: "fixed_10y", tenor: 30, rateType: "fixed", rates: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating", "Floating"] },
    { id: 57, developerCategory: "Top Selected Developer", name: "tiered_30y", tenor: 30, rateType: "tiered", rates: [3.5, 5.5, 5.5, 7.5, 7.5, 9.5, 9.5, 9.5, 9.5, 9.5, 11, 11, 11, 11, 11, 11.5, 11.5, 11.5, 11.5, 11.5, 12, 12, 12, 12, 12, 12.5, 12.5, 12.5, 12.5, 12.5] },
  ];

  const getPackageIdByNameTenor = (name: string, tenor: number): number | undefined => {
    return RATE_TABLE.find((r) => r.name === name && r.tenor === tenor)?.id;
  };

  const tenorSelected = Number(formData.loanTerm || 0);
  const availablePackages = useMemo(() => PACKAGES_BY_TENOR[tenorSelected] || [], [tenorSelected]);
  const selectedRate = useMemo(() => {
    const idNum = Number(formData.kprRateId);
    if (Number.isFinite(idNum) && idNum > 0) {
      return RATE_TABLE.find((r) => r.id === idNum);
    }
    // fallback for legacy string values
    return RATE_TABLE.find((r) => r.tenor === tenorSelected && r.name === formData.kprRateId);
  }, [tenorSelected, formData.kprRateId]);

  const formatRate = (v: number | "Floating" | "—") =>
    typeof v === "number"
      ? `${v.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
      : v;

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

  // Label for Paket KPR options
  const labelForPackage = (name: string) => {
    const match = name.match(/(fixed|tiered)_(\d+)y/);
    if (!match) return name.replaceAll("_", " ");
    const kind = match[1];
    const years = Number(match[2]);
    if (kind === "tiered") return `Fixed Berjenjang ${years} Tahun`;
    return `Fixed ${years} Tahun`;
  };

  // ===== Fees and loan with fees (as per request) =====
  const ADMIN_FEE = 2_500_000; // Rp 2.500.000,-
  const baseLoan = Math.max(0, hargaProperti - downPayment);
  const provisiFromBase = Math.round(baseLoan * 0.01); // 1% of (Harga - DP)
  const loanWithFees = Math.max(0, hargaProperti + ADMIN_FEE + provisiFromBase - downPayment);

  // ===== Multi-rate yearly simulation (equal principal per year) =====
  // Floating rate: use draft value and apply via Refresh button
  const [floatingRate, setFloatingRate] = useState<number>(10.75);
  const [floatingRateDraft, setFloatingRateDraft] = useState<number>(10.75);
  const yearlySim = useMemo(() => {
    if (!tenorSelected || !loanWithFees) return null;
    const years = tenorSelected;
    const principalPerYear = loanWithFees / years;
    let outstanding = loanWithFees;
    const perYear: { year: number; rate: number; interest: number; payment: number; remaining: number }[] = [];
    for (let i = 1; i <= years; i++) {
      let rateVal: number = floatingRate;
      const rateDef = selectedRate?.rates[i - 1];
      if (typeof rateDef === "number") rateVal = rateDef;
      // If 'Floating' or '—', use floatingRateInput
      const interest = outstanding * (rateVal / 100);
      const payment = principalPerYear + interest;
      const remaining = Math.max(0, outstanding - principalPerYear);
      perYear.push({ year: i, rate: rateVal, interest, payment, remaining });
      outstanding = remaining;
    }
    const totalPayment = perYear.reduce((s, y) => s + y.payment, 0);
    const totalInterest = totalPayment - loanWithFees;
    return { perYear, totalPayment, totalInterest, firstYearPayment: perYear[0]?.payment || 0 };
  }, [tenorSelected, loanWithFees, selectedRate, floatingRate]);

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

            <SelectField
              required
              label="Jangka Waktu (Tenor)"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={(e: any) => {
                // Update tenor
                handleChange(e);
                const newTenor = Number(e.target.value || 0);
                const nextIds = (PACKAGES_BY_TENOR[newTenor] || [])
                  .map((n) => getPackageIdByNameTenor(n, newTenor))
                  .filter((v): v is number => typeof v === "number");
                const currentId = Number(formData.kprRateId);
                // Clear selected paket if no longer compatible with new tenor
                if (!nextIds.includes(currentId)) {
                  handleChange({ target: { name: "kprRateId", value: "" } });
                }
              }}
              error={errors.loanTerm}
            >
              <option value="">Pilih Tenor...</option>
              {TENOR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y} Tahun</option>
              ))}
            </SelectField>

            <SelectField
              required
              label="Paket KPR"
              name="kprRateId"
              value={formData.kprRateId}
              onChange={handleChange}
              error={errors.kprRateId}
            >
              <option value="">{tenorSelected ? "Pilih Paket..." : "Pilih tenor terlebih dahulu"}</option>
              {availablePackages.map((name) => {
                const id = getPackageIdByNameTenor(name, tenorSelected);
                if (!id) return null;
                return (
                  <option key={name} value={id}>{labelForPackage(name)}</option>
                );
              })}
            </SelectField>

            <FileInputField required label="Upload KTP (.jpg/.pdf, max 2MB)" name="fileKTP" file={formData.fileKTP} onChange={handleChange} error={errors.fileKTP} />
            <FileInputField required label="Upload Slip Gaji (.pdf, max 2MB)" name="fileSlipGaji" file={formData.fileSlipGaji} onChange={handleChange} error={errors.fileSlipGaji} />
          </div>
        </div>

        {/* ===== Detail Pengajuan KPR ===== */}
        <div className="border rounded-xl p-5 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Detail Pengajuan KPR</h3>

          {(() => {
            const ADMIN_FEE_LOCAL = ADMIN_FEE;
            const baseLoanLocal = baseLoan;
            const provisi = provisiFromBase;
            const loanResult = loanWithFees;

            return (
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex items-center justify-between"><span>Home Price</span><span className="font-semibold">{formatCurrency(hargaProperti)}</span></div>
                <div className="flex items-center justify-between"><span>Administrasi</span><span className="font-semibold">{formatCurrency(ADMIN_FEE_LOCAL)}</span></div>
                <div className="flex items-center justify-between"><span>Biaya Provisi (1,00% dari Harga - DP)</span><span className="font-semibold">{formatCurrency(provisi)}</span></div>
                <div className="flex items-center justify-between"><span>Downpayment (Pengurang)</span><span className="font-semibold">{formatCurrency(downPayment)}</span></div>
                <div className="flex items-center justify-between border-t pt-2 mt-2"><span>Loan</span><span className="font-semibold">{formatCurrency(loanResult)}</span></div>
                <div className="flex items-center justify-between"><span>Paket KPR</span><span className="font-semibold">{selectedRate ? labelForPackage(selectedRate.name) : "—"}</span></div>

                {/* Rate Detail */}
                <div className="md:col-span-2 mt-3">
                  <p className="font-semibold text-gray-800 mb-2">Rate Detail</p>
                  {selectedRate ? (
                    <div className="rounded-lg border bg-white p-3">
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">{labelForPackage(selectedRate.name)}</span>
                        {" · "}
                        {tenorSelected} Tahun
                        {" · "}
                        {selectedRate.rateType}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: Math.max(tenorSelected, selectedRate.rates.length) }).map((_, idx) => {
                          const year = idx + 1;
                          const v = selectedRate.rates[idx] ?? (selectedRate.rateType === "fixed" ? "Floating" : "—");
                          return (
                            <span key={year} className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs bg-gray-50">
                              <span className="text-gray-500">Y{year}:</span>
                              <span className="font-medium text-gray-800">{formatRate(v)}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Pilih tenor dan paket untuk melihat detail rate.</p>
                  )}
                </div>
              </div>
            );
          })()}
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
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Estimasi Pembayaran Tahun Pertama</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(yearlySim?.firstYearPayment || 0)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-700 flex items-center gap-2">
                      Floating Rate (%)
                      <input
                        type="number"
                        step="0.01"
                        value={floatingRateDraft}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const normalized = raw.replace(",", ".");
                          const n = Number(normalized);
                          setFloatingRateDraft(Number.isFinite(n) ? n : 0);
                        }}
                        className="w-24 rounded border px-2 py-1 text-right"
                        placeholder="cth: 10.75"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setFloatingRate(floatingRateDraft)}
                      className="px-3 py-1.5 rounded-md bg-bni-orange text-white text-xs font-semibold hover:bg-orange-600"
                      title="Refresh simulasi"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <p>Jumlah Pinjaman: <span className="font-semibold">{formatCurrency(loanWithFees)}</span></p>
                  <p>Total Bunga: <span className="font-semibold">{formatCurrency(yearlySim?.totalInterest || 0)}</span></p>
                  <p>Total Pembayaran: <span className="font-semibold">{formatCurrency(yearlySim?.totalPayment || 0)}</span></p>
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
