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
  const inputClass = `w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${
    error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
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
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </label>
  );
}
