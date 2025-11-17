"use client";
export default function Field({
  name,
  label,
  value,
  onChange,
  type = "text",
  error,
}: {
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
}) {
  const inputClass = `w-full rounded-xl border px-3 py-2 bg-white text-[var(--color-gray-900)] placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
    error ? "border-[#FF8500] focus:ring-[#FF8500]" : "border-gray-300 focus:ring-blue-500"
  }`;

  return (
    <label className="block">
      <span className="block text-sm text-gray-500 mb-1">{label}</span>
      <input
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        className={inputClass}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-[#FF8500]">
          {error}
        </p>
      )}
    </label>
  );
}
