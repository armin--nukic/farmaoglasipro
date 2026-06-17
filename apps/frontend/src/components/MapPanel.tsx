import { useState } from "react";
import { Building2, Crosshair, MapPin, Minus, PawPrint, Plus, Stethoscope } from "lucide-react";
import { Card } from "./ui/card";

const markers = [
  { top: 36, left: 53, label: "Sarajevo", meta: "Grla + veterinari", type: "animal", Icon: PawPrint },
  { top: 24, left: 33, label: "Banja Luka", meta: "Stanica", type: "station", Icon: Crosshair },
  { top: 30, left: 66, label: "Tuzla", meta: "Veterinar", type: "vet", Icon: Stethoscope },
  { top: 55, left: 25, label: "Livno", meta: "Farma", type: "farm", Icon: Building2 },
  { top: 66, left: 58, label: "Mostar", meta: "Farma", type: "farm", Icon: Building2 },
  { top: 45, left: 42, label: "Travnik", meta: "Ovce", type: "animal", Icon: PawPrint }
];

export function MapPanel({ compact = false }: { compact?: boolean }) {
  const [zoom, setZoom] = useState(1);

  return (
    <Card className={`relative overflow-hidden bg-[#eef4ef] ${compact ? "min-h-[260px]" : "min-h-[390px]"}`}>
      <div className="absolute left-3 top-3 z-10 flex gap-2">
        <button className="grid h-9 w-9 place-items-center rounded-md bg-white text-primary shadow-soft dark:bg-[#102017]" onClick={() => setZoom((value) => Math.min(value + 0.2, 1.8))} aria-label="Zoom in"><Plus size={17} /></button>
        <button className="grid h-9 w-9 place-items-center rounded-md bg-white text-primary shadow-soft dark:bg-[#102017]" onClick={() => setZoom((value) => Math.max(value - 0.2, 0.8))} aria-label="Zoom out"><Minus size={17} /></button>
      </div>
      <div className="absolute right-3 top-3 z-10 rounded-md bg-white/95 px-3 py-2 text-xs font-black shadow-soft dark:bg-[#102017]">OpenStreetMap | {zoom.toFixed(1)}x</div>
      <div className="absolute inset-0 origin-center transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 520" preserveAspectRatio="none" aria-hidden="true">
          <rect width="900" height="520" fill="#eef4ef" />
          <path d="M-40 410 C160 340 280 430 430 350 S700 260 940 330" fill="none" stroke="#d8e7d9" strokeWidth="88" />
          <path d="M-30 146 C160 120 220 230 380 205 S650 90 940 138" fill="none" stroke="#dfe8dd" strokeWidth="66" />
          <path d="M80 520 C170 385 270 330 380 248 S575 154 760 -20" fill="none" stroke="#ffffff" strokeWidth="24" />
          <path d="M80 520 C170 385 270 330 380 248 S575 154 760 -20" fill="none" stroke="#f0c36a" strokeWidth="8" />
          <path d="M-40 268 C120 236 220 285 332 262 S530 190 715 230 S865 254 940 220" fill="none" stroke="#ffffff" strokeWidth="20" />
          <path d="M-40 268 C120 236 220 285 332 262 S530 190 715 230 S865 254 940 220" fill="none" stroke="#9bbca3" strokeWidth="6" />
          <path d="M118 -20 C180 84 210 148 190 238 S184 402 235 540" fill="none" stroke="#ffffff" strokeWidth="18" />
          <path d="M118 -20 C180 84 210 148 190 238 S184 402 235 540" fill="none" stroke="#9bbca3" strokeWidth="5" />
          <path d="M-20 86 C180 128 280 80 420 132 S660 208 920 172" fill="none" stroke="#9bd1ee" strokeWidth="18" opacity=".75" />
          {Array.from({ length: 13 }).map((_, index) => <path key={`v-${index}`} d={`M${index * 75} 0 V520`} stroke="#d7e4d8" strokeWidth="1" opacity=".8" />)}
          {Array.from({ length: 8 }).map((_, index) => <path key={`h-${index}`} d={`M0 ${index * 74} H900`} stroke="#d7e4d8" strokeWidth="1" opacity=".8" />)}
        </svg>
        {markers.map(({ Icon, label, meta, top, left, type }) => (
          <div key={label} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-black shadow-soft dark:bg-[#102017]" style={{ top: `${top}%`, left: `${left}%` }}>
            <Icon size={16} className={type === "animal" ? "text-accent" : "text-primary"} />
            <span>{label}</span>
            {!compact && <span className="text-slate-500">| {meta}</span>}
          </div>
        ))}
      </div>
      {!compact && <div className="absolute bottom-3 left-3 rounded-md bg-white/95 px-3 py-2 text-xs font-bold shadow-soft dark:bg-[#102017]"><MapPin size={14} className="mr-1 inline text-primary" />Gradovi, farme, veterinari, stanice i zivotinje</div>}
    </Card>
  );
}
