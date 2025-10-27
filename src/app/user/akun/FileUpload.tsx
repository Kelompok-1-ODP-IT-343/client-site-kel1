"use client";
export default function FileUpload({
  name,
  label,
  onChange,
}: {
  name: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="block text-sm text-gray-500 font-medium">{label}</span>
      <label className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded-xl cursor-pointer hover:bg-gray-300 transition">
        📎 Pilih File
        <input
          type="file"
          name={name}
          accept=".jpg,.jpeg,.png"
          onChange={onChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
