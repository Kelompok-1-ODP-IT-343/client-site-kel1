"use client";

import { Clock, CheckCircle, CreditCard, Bell } from "lucide-react";
import { cn } from "@/app/lib/util";

interface NotificationCardProps {
  title: string;
  message: string;
  time: string;
  type: "approval" | "payment" | "reminder";
}

const TYPE_STYLES = {
  approval: {
    icon: <CheckCircle size={20} className="text-[#3FD8D4]" />,
    badge: "bg-[#FF8500] text-white",
    label: "Persetujuan",
    border: "bg-[#007AFF]",
  },
  payment: {
    icon: <CreditCard size={20} className="text-blue-500" />,
    badge: "bg-[#FFC107] text-gray-900",
    label: "Pembayaran",
    border: "bg-[#007AFF]",
  },
  reminder: {
    icon: <Bell size={20} className="text-teal-500" />,
    badge: "bg-gray-200 text-gray-600",
    label: "Pengingat",
    border: "bg-[#007AFF]",
  },
};

export default function NotificationCard({
  title,
  message,
  time,
  type,
}: NotificationCardProps) {
  const styles = TYPE_STYLES[type];

  return (
    <div className="relative w-full bg-white rounded-xl p-4 border border-gray-200 transition-all">
      {/* Left Accent */}
      <div className={cn("absolute left-0 top-0 h-full w-1 rounded-l-lg", styles.border)} />

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="bg-gray-100 p-2 rounded-lg">{styles.icon}</div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{message}</p>

          {/* Time Info */}
          <div className="flex items-center gap-1 text-gray-400 text-xs mt-2">
            <Clock size={12} />
            <span>{time}</span>
          </div>
        </div>

        {/* Badge */}
        <span className={cn("text-xs font-semibold px-3 py-1 rounded-md", styles.badge)}>
          {styles.label}
        </span>
      </div>
    </div>
  );
}
