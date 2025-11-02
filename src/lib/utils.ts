import { type ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to merge Tailwind class names with conditional classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
