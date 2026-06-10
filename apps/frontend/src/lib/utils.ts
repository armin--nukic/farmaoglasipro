import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | string, currency = "BAM") {
  return new Intl.NumberFormat("bs-BA", { style: "currency", currency }).format(Number(value));
}
