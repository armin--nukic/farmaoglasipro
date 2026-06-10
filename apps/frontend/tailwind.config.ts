import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "#2E7D32", foreground: "#ffffff" },
        secondary: { DEFAULT: "#66BB6A", foreground: "#0e2a10" },
        accent: { DEFAULT: "#F9A825", foreground: "#201700" },
        danger: { DEFAULT: "#E53935", foreground: "#ffffff" }
      },
      boxShadow: {
        soft: "0 12px 35px rgba(15, 23, 42, 0.09)"
      }
    }
  },
  plugins: []
} satisfies Config;
