"use client";

import { ChevronDown } from "lucide-react";

type SelectFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  // Opsional: peta untuk menampilkan label berbeda dari nilai option
  labelMap?: Record<string, string>;
  disabled?: boolean; // ✅ tambahkan dukungan properti opsional
  error?: string;
  // Tampilkan ring oranye sebagai peringatan (tanpa teks error)
  warning?: boolean;
  // Sembunyikan teks error walaupun ada nilai error
  hideErrorText?: boolean;
  // Opsional: override class tambahan untuk <select>
  className?: string;
};

export default function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  labelMap,
  disabled = false, // ✅ default false
  error,
  warning = false,
  hideErrorText = false,
  className,
}: SelectFieldProps) {
  const baseClass =
    "w-full rounded-lg border border-gray-300 px-4 pr-10 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 appearance-none";

  const stateClass = disabled
    ? "bg-gray-100 cursor-not-allowed text-gray-400"
    : error
    ? "border-red-500 focus:ring-red-500"
    : warning
    ? "border-orange-400 focus:ring-orange-400"
  : "focus:ring-blue-500";

  const selectClass = `${baseClass} ${stateClass}`;

  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${selectClass} ${className ?? ""}`}
        >
          <option value="">Pilih...</option>
          {options.map((opt) => {
            const labelText = labelMap?.[opt] ?? opt.replaceAll("_", " ");
            return (
              <option key={opt} value={opt}>
                {labelText}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${
            disabled ? "text-gray-400" : error ? "text-red-500" : warning ? "text-orange-400" : "text-gray-500"
          }`}
        />
      </div>
      {error && !hideErrorText && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </label>
  );
}
