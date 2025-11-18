"use client";

interface Props {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  className?: string;
}

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
  readOnly = false,
  maxLength,
  className,
}: Props) {
  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <label className="text-sm font-medium text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value || ""}
        maxLength={maxLength}
        readOnly={readOnly}
        onChange={onChange}
        className={`rounded-lg border border-gray-300 text-gray-900 focus:border-bni-teal focus:ring-1 focus:ring-bni-teal px-4 py-2.5 outline-none transition placeholder:text-gray-400
          ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
          ${error ? "border-red-500 ring-1 ring-red-200" : ""}
        `}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}