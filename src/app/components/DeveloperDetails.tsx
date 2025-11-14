"use client";

import { useState } from "react";
import {
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  Copy,
  ExternalLink,
} from "lucide-react";

type Dev = {
  companyName?: string | null;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
};

export default function DeveloperDetails({ dev }: { dev?: Dev | null }) {
  const [open, setOpen] = useState(false);
  const company = dev?.companyName || "-";

  // Choose first available contact method for "Hubungi Developer" button
  const contactHref = (() => {
    if (dev?.phone) return `tel:${dev.phone}`;
    if (dev?.email) return `mailto:${dev.email}`;
    if (dev?.website) return dev.website.startsWith("http") ? dev.website : `https://${dev.website}`;
    return undefined;
  })();

  const openContact = () => {
    if (!contactHref) return;
    window.open(contactHref, contactHref.startsWith("http") ? "_blank" : undefined);
  };

  const copyToClipboard = (value?: string | null) => {
    if (!value) return;
    navigator.clipboard.writeText(value).catch(() => {});
  };

  return (
    <>
      {/* Tile */}
      <div className="text-left p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-start gap-3 text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 group-hover:shadow-inner">
            <Building className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] tracking-wide text-gray-500 mb-0.5">Detail Developer</p>
            <p className="font-semibold text-sm text-gray-900 line-clamp-1">{company}</p>
          </div>
        </button>
    
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-3">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[82vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <Building className="text-orange-500" size={18} />
                <h3 className="text-sm font-semibold text-gray-800">Detail Developer</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Quick Contact Pills */}
            <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 text-[11px]">
              {dev?.phone && (
                <ContactPill href={`tel:${dev.phone}`} icon={<Phone className="w-3 h-3" />}>Telepon</ContactPill>
              )}
              {dev?.email && (
                <ContactPill href={`mailto:${dev.email}`} icon={<Mail className="w-3 h-3" />}>Email</ContactPill>
              )}
              {dev?.website && (
                <ContactPill
                  href={dev.website.startsWith("http") ? dev.website : `https://${dev.website}`}
                  icon={<Globe className="w-3 h-3" />}
                  newTab
                >
                  Website
                </ContactPill>
              )}
            </div>

            <div className="px-4 pb-4 space-y-2 text-[12px]">
              <Row label="Perusahaan" value={dev?.companyName} />
              <Row label="Contact Person" value={dev?.contactPerson} />
              <Row
                label="Telepon"
                value={dev?.phone}
                icon={<Phone size={13} className="text-gray-500" />}
                onCopy={() => copyToClipboard(dev?.phone)}
                copyTitle="Salin nomor"
              />
              <Row
                label="Email"
                value={dev?.email}
                icon={<Mail size={13} className="text-gray-500" />}
                onCopy={() => copyToClipboard(dev?.email)}
                copyTitle="Salin email"
              />
              <Row
                label="Website"
                value={dev?.website}
                icon={<Globe size={13} className="text-gray-500" />}
                link={dev?.website ? (dev.website.startsWith("http") ? dev.website : `https://${dev.website}`) : undefined}
              />
              <Row
                label="Alamat"
                value={dev?.address}
                icon={<MapPin size={13} className="text-gray-500" />}
              />
              <Row label="Kota" value={dev?.city} />
              <Row label="Provinsi" value={dev?.province} />
            </div>

            <div className="px-4 py-3 border-t flex justify-between gap-2">
              <div className="flex gap-2">
              </div>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md bg-bni-orange text-white text-xs font-semibold hover:bg-orange-600"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
type RowProps = {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
  link?: string;
  onCopy?: () => void;
  copyTitle?: string;
};

function Row({ label, value, icon, link, onCopy, copyTitle }: RowProps) {
  const v = value && String(value).trim().length > 0 ? value : "-";
  const content = link && v !== "-" ? (
    <a
      href={link}
      target={link.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="text-gray-800 font-medium hover:text-bni-orange flex items-center gap-1"
    >
      <span className="break-words">{v}</span>
      {link.startsWith("http") && <ExternalLink className="w-3 h-3 text-gray-400" />}
    </a>
  ) : (
    <div className="font-medium text-gray-800 break-words">{v}</div>
  );
  return (
    <div className="flex items-start gap-2">
      {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
      <div className="w-24 text-gray-500 shrink-0">{label}</div>
      <div className="flex-1 min-w-0 flex items-start gap-2">
        {content}
        {onCopy && v !== "-" && (
          <button
            type="button"
            onClick={onCopy}
            title={copyTitle}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function ContactPill({
  href,
  children,
  icon,
  newTab,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  newTab?: boolean;
}) {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-bni-orange font-medium transition"
    >
      {icon}
      {children}
    </a>
  );
}
