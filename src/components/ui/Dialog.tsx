"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type DialogProps = {
  open: boolean;
  title?: React.ReactNode;
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
    const el = document.documentElement;
    if (open) {
      el.setAttribute("data-dialog-open", "true");
      document.body.style.overflow = "hidden";
    } else {
      el.removeAttribute("data-dialog-open");
      document.body.style.overflow = "";
    }
    return () => {
      el.removeAttribute("data-dialog-open");
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] isolation-isolate flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${animateIn ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Tutup dialog"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
      />
      <div
        className={`relative z-[2147483647] w-[90vw] max-w-[520px] max-h-[80vh] rounded-2xl bg-white shadow-xl border border-gray-200 transition-transform duration-200 ${animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
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
            <div className="mt-3 text-sm text-gray-700 overflow-auto text-center" style={{ maxHeight: "64vh" }}>
              {description}
            </div>
          )}
          {actions ? <div className="mt-4 flex w-full justify-center gap-3">{actions}</div> : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
