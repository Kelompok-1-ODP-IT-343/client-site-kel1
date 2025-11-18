"use client";

interface Props {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
}

export default function TextAreaField({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  required,
}: Props) {
  return (
    <div className="flex flex-col md:col-span-2">
      <label className="text-sm font-medium text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`rounded-lg border border-gray-300 text-gray-900 focus:border-bni-teal focus:ring-1 focus:ring-bni-teal px-4 py-2.5 outline-none transition placeholder:text-gray-400
          ${error ? "border-red-500 ring-1 ring-red-200" : ""}
        `}
        required={required}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
