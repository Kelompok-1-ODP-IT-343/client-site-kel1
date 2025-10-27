"use client";
import { ReactNode } from "react";
import { cn } from "@/app/lib/util";

export default function SummaryCard({
  icon,
  title,
  value,
  accent,
  isMoney = false,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  accent: string;
  isMoney?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 bg-white/80 border border-white shadow-sm hover:shadow-md transition"
      style={{ boxShadow: `0 6px 16px -6px ${accent}55` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white shadow"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
          }}
        >
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p
          className={cn(
            "mt-1 font-extrabold tracking-tight",
            isMoney ? "text-xl" : "text-2xl"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
