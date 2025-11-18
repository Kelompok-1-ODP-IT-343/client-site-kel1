"use client";

import React, { useEffect } from "react";

type DialogProps = {
  open: boolean;
  title?: string;
  description?: React.ReactNode;
  onClose: () => void;
  actions?: React.ReactNode;
};

export default function Dialog({ open, title, description, onClose, actions }: DialogProps) {
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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white shadow-lg p-6">
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        {description && <div className="mt-2 text-sm text-gray-600">{description}</div>}
        <div className="mt-6 flex justify-end gap-3">
          {actions}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}