import { useState } from "react";
import { Building2, Crosshair, Layers, MapPin, Minus, PawPrint, Plus, Stethoscope } from "lucide-react";
import { Card } from "./ui/card";

const markers = [
  { top: 38, left: 54, label: "Sarajevo", meta: "Grla + veterinari", count: "42", type: "animal", Icon: PawPrint },
  { top: 22, left: 31, label: "Banja Luka", meta: "Vet stanica", count: "8", type: "station", Icon: Crosshair },
  { top: 30, left: 67, label: "Tuzla", meta: "Veterinar", count: "11", type: "vet", Icon: Stethoscope },
  { top: 58, left: 24, label: "Livno", meta: "Farma", count: "15", type: "farm", Icon: Building2 },
  { top: 69, left: 59, label: "Mostar", meta: "Farma", count: "9", type: "farm", Icon: Building2 },
  { top: 47, left: 42, label: "Travnik", meta: "Ovce", count: "27", type: "animal", Icon: PawPrint }
];

export function MapPanel({ compact = false }: { compact?: boolean }) {
  const [zoom, setZoom] = useState(1);

  return (
    <Card className={`relative overflow-hidden bg-[#eef4ef] ${compact ? "min-h-[260px]" : "min-h-[430px]"}`}>
      <div className="absolute left-3 top-3 z-10 flex gap-2">
        <button className="grid h-9 w-9 place-items-center rounded-md bg-white text-primary shadow-soft dark:bg-[#102017]" onClick={() => setZoom((value) => Math.min(value + 0.2, 1.8))} aria-label="Uvecaj mapu"><Plus size={17} /></button>
        <button className="grid h-9 w-9 place-items-center rounded-md bg-white text-primary shadow-soft dark:bg-[#102017]" onClick={() => setZoom((value) => Math.max(value - 0.2, 0.8))} aria-label="Smanji mapu"><Minus size={17} /></button>
      </div>
      <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-xs font-black shadow-soft dark:bg-[#102017]"><Layers size={14} />Mapa BiH | {zoom.toFixed(1)}x</div>
      <div className="absolute inset-0 origin-center transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 520" preserveAspectRatio="none" aria-hidden="true">
          <rect width="900" height="520" fill="#eef4ef" />
          <path d="M38 118 C152 78 278 114 352 88 C496 38 632 54 820 102 L900 0 L0 0 L0 152 Z" fill="#d9ebd5" opacity=".9" />
          <path d="M580 520 C626 432 720 390 900 405 L900 520 Z" fill="#d7ead4" />
          <path d="M-40 410 C160 340 280 430 430 350 S700 260 940 330" fill="none" stroke="#d8e7d9" strokeWidth="88" />
          <path d="M-30 146 C160 120 220 230 380 205 S650 90 940 138" fill="none" stroke="#dfe8dd" strokeWidth="66" />
          <path d="M-20 86 C180 128 280 80 420 132 S660 208 920 172" fill="none" stroke="#9bd1ee" strokeWidth="18" opacity=".75" />
          <path d="M80 520 C170 385 270 330 380 248 S575 154 760 -20" fill="none" stroke="#ffffff" strokeWidth="24" />
          <path d="M80 520 C170 385 270 330 380 248 S575 154 760 -20" fill="none" stroke="#f0c36a" strokeWidth="8" />
          <path d="M-40 268 C120 236 220 285 332 262 S530 190 715 230 S865 254 940 220" fill="none" stroke="#ffffff" strokeWidth="20" />
          <path d="M-40 268 C120 236 220 285 332 262 S530 190 715 230 S865 254 940 220" fill="none" stroke="#9bbca3" strokeWidth="6" />
          <path d="M118 -20 C180 84 210 148 190 238 S184 402 235 540" fill="none" stroke="#ffffff" strokeWidth="18" />
          <path d="M118 -20 C180 84 210 148 190 238 S184 402 235 540" fill="none" stroke="#9bbca3" strokeWidth="5" />
          <path d="M-30 348 C122 354 250 340 386 386 S658 470 930 428" fill="none" stroke="#ffffff" strokeWidth="14" />
          <path d="M-30 348 C122 354 250 340 386 386 S658 470 930 428" fill="none" stroke="#bfd2bd" strokeWidth="4" />
          {Array.from({ length: 13 }).map((_, index) => <path key={`v-${index}`} d={`M${index * 75} 0 V520`} stroke="#d7e4d8" strokeWidth="1" opacity=".8" />)}
          {Array.from({ length: 8 }).map((_, index) => <path key={`h-${index}`} d={`M0 ${index * 74} H900`} stroke="#d7e4d8" strokeWidth="1" opacity=".8" />)}
        </svg>
        {markers.map(({ Icon, label, meta, count, top, left, type }) => (
          <div key={label} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border border-white/70 bg-white px-3 py-2 text-xs font-black shadow-soft dark:border-white/10 dark:bg-[#102017]" style={{ top: `${top}%`, left: `${left}%` }}>
            <Icon size={16} className={type === "animal" ? "text-accent" : "text-primary"} />
            <span>{label}</span>
            {!compact && <span className="text-slate-500">| {meta}</span>}
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{count}</span>
          </div>
        ))}
      </div>
      {!compact && <div className="absolute bottom-3 left-3 rounded-md bg-white/95 px-3 py-2 text-xs font-bold shadow-soft dark:bg-[#102017]"><MapPin size={14} className="mr-1 inline text-primary" />Gradovi, farme, veterinari, stanice i zivotinje</div>}
    </Card>
  );
}
