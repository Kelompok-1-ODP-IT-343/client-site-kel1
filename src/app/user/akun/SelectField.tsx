"use client";

type SelectFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
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
  disabled = false, // ✅ default false
  error,
  warning = false,
  hideErrorText = false,
  className,
}: SelectFieldProps) {
  const baseClass =
    "w-full rounded-xl border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2";

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
      <span className="block text-sm text-gray-500 mb-1">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled} // ✅ gunakan di elemen <select>
        className={`${selectClass} ${className ?? ""}`}
      >
        <option value="">Pilih...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && !hideErrorText && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </label>
  );
}
