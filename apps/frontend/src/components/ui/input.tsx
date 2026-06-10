import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none ring-primary/20 transition focus:ring-4 dark:bg-[#102017]", className)} {...props} />;
}
