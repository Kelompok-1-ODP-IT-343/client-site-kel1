"use client";
import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/util";

export default function SidebarItem({
  title,
  icon,
  onClick,
  active,
}: {
  title: string;
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-5 py-4 transition",
        active ? "bg-blue-50" : "hover:bg-gray-50"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          active ? "text-blue-600" : "text-gray-800"
        )}
      >
        <div
          className={cn(
            "h-9 w-9 grid place-items-center rounded-xl",
            active ? "bg-blue-100" : "bg-gray-100"
          )}
        >
          {icon}
        </div>
        <span className="font-semibold">{title}</span>
      </div>
      <ChevronRight
        className={cn("h-4 w-4", active ? "text-blue-600" : "text-gray-400")}
      />
    </button>
  );
}
