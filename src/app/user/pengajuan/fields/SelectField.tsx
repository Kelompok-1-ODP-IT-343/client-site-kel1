"use client";

import { ChevronDown } from "lucide-react";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  disabled,
  children,
}: Props) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full rounded-lg border border-gray-300 text-gray-900 focus:border-bni-teal focus:ring-1 focus:ring-bni-teal px-4 pr-10 py-2.5 outline-none transition appearance-none bg-white
            ${error ? "border-red-500 ring-1 ring-red-200" : ""}
            ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
          `}
        >
          {children}
        </select>
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none
            ${disabled ? "text-gray-400" : error ? "text-red-500" : "text-gray-500"}
          `}
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
