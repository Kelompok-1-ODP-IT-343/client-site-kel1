"use client";

import { cn } from "@/app/lib/util";

export default function InfoItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl bg-gray-50 border border-gray-100 p-4",
        className
      )}
    >
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900 leading-snug whitespace-normal break-all">
        {value}
      </p>
    </div>
  );
}
