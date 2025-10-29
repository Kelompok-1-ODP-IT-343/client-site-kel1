"use client";

interface Props {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  file: File | null;
}

export default function FileInputField({
  label,
  name,
  onChange,
  error,
  required,
  file,
}: Props) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onChange}
        className={`file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold 
        file:bg-bni-teal/10 file:text-bni-teal hover:file:bg-bni-teal/20 
        block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer
        ${error ? "border-red-500 ring-1 ring-red-200" : ""}`}
      />

      {file && (
        <p className="mt-1 text-xs text-gray-500">File: {file.name}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
