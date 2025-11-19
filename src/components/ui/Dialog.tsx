"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

type DialogProps = {
  open: boolean;
  title?: string;
  description?: React.ReactNode;
  onClose: () => void;
  actions?: React.ReactNode;
};

export default function Dialog({ open, title, description, onClose, actions }: DialogProps) {
  const [animateIn, setAnimateIn] = useState(false);
  useEffect(() => {
    setAnimateIn(true);
    return () => setAnimateIn(false);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${animateIn ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full max-w-[min(86vw,1024px)] max-h-[80vh] rounded-2xl bg-white shadow-xl border border-gray-200 transition-transform duration-200 ${animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 pt-4 relative">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 text-center w-full">{title || "Pratinjau Dokumen"}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-3 right-3 inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 pb-5">
          {description && (
            <div className="mt-3 text-sm text-gray-700 overflow-auto" style={{ maxHeight: "64vh" }}>
              {description}
            </div>
          )}
          {actions ? <div className="mt-4 flex justify-end gap-3">{actions}</div> : null}
        </div>
      </div>
    </div>
  );
}