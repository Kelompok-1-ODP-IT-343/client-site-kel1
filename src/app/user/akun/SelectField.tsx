"use client";

type SelectFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  disabled?: boolean; // ✅ tambahkan dukungan properti opsional
};

export default function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  disabled = false, // ✅ default false
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-500 mb-1">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled} // ✅ gunakan di elemen <select>
        className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""
        }`}
      >
        <option value="">Pilih...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
