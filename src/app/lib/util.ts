import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format region names to Title Case while preserving common Indonesian acronyms
// Examples: "JAWA BARAT" -> "Jawa Barat", "DKI JAKARTA" -> "DKI Jakarta", "KAB. BANDUNG" -> "Kab. Bandung"
export function formatRegionLabel(text: string): string {
  if (!text) return "";
  const SPECIAL: Record<string, string> = {
    dki: "DKI",
    diy: "DIY",
    ntb: "NTB",
    ntt: "NTT",
    di: "DI",
    "d.i": "DI",
    "d.i.": "DI",
  };

  const toTitle = (segment: string) => {
    // Preserve special acronyms
    const key = segment.replace(/[^a-z.]/gi, "").toLowerCase();
    const special = SPECIAL[key];
    if (special) return special + segment.replace(/^[a-z.]+/i, "");

    // Title-case regular words, keep punctuation such as '.' or '-'
    const lower = segment.toLowerCase();
    return lower.replace(/\b([a-z])([a-z]*)/gi, (_, a: string, b: string) => a.toUpperCase() + b);
  };

  // Split by spaces, but also handle hyphen and slash inside tokens
  return text
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((tok) => tok.split(/([-/])/).map((part) => (part === "-" || part === "/" ? part : toTitle(part))).join(""))
    .join(" ");
}
