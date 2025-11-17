"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/authContext";
import Dialog from "@/components/ui/Dialog";

type Props = {
  href: string; // target ketika sudah login
  className?: string;
  children: React.ReactNode;
};

export default function AjukanCTA({ href, className, children }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setOpen(true);
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={className}
      >
        {children}
      </button>

      <Dialog
        open={open}
        title="Masuk ke Akun"
        description={<p>Untuk mengajukan KPR, silakan masuk terlebih dahulu.</p>}
        onClose={() => setOpen(false)}
        actions={
          <button
            type="button"
            onClick={() => router.push(`/login?next=${encodeURIComponent(href)}`)}
            className="px-4 py-2 rounded-md bg-[#FF8500] text-white hover:bg-[#e67800]"
          >
            Masuk Sekarang
          </button>
        }
      />
    </>
  );
}