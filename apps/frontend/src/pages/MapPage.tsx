import { useMemo, useState } from "react";
import { Building2, Crosshair, MapPin, Minus, PawPrint, Plus, Stethoscope } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useI18n } from "../i18n";

const markers = [
  { city: "Sarajevo", type: "animal", top: 38, left: 53, label: "Simental grla", Icon: PawPrint },
  { city: "Banja Luka", type: "station", top: 23, left: 32, label: "Vet stanica", Icon: Crosshair },
  { city: "Tuzla", type: "vet", top: 31, left: 66, label: "Veterinar", Icon: Stethoscope },
  { city: "Travnik", type: "animal", top: 45, left: 42, label: "Ovce", Icon: PawPrint },
  { city: "Livno", type: "farm", top: 57, left: 25, label: "Farma", Icon: Building2 },
  { city: "Mostar", type: "farm", top: 68, left: 58, label: "Farma", Icon: Building2 }
];

export function MapPage() {
  const { t } = useI18n();
  const [zoom, setZoom] = useState(1);
  const [type, setType] = useState("all");
  const [city, setCity] = useState("all");
  const cities = useMemo(() => ["all", ...Array.from(new Set(markers.map((marker) => marker.city)))], []);
  const visible = markers.filter((marker) => (type === "all" || marker.type === type) && (city === "all" || marker.city === city));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">{t.maps}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Street mapa za farme, veterinare, stanice, zivotinje i grla sa zoom kontrolama i gradskim filterima.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "farm", "animal", "vet", "station"].map((item) => (
            <button key={item} onClick={() => setType(item)} className={`rounded-md px-3 py-2 text-xs font-black ${type === item ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>{item}</button>
          ))}
        </div>
      </div>

      <Card className="relative min-h-[620px] overflow-hidden bg-[#eef4ef]">
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          <Button onClick={() => setZoom((value) => Math.min(value + 0.2, 2))}><Plus size={18} /></Button>
          <Button onClick={() => setZoom((value) => Math.max(value - 0.2, 0.8))}><Minus size={18} /></Button>
        </div>
        <select value={city} onChange={(event) => setCity(event.target.value)} className="absolute right-4 top-4 z-10 h-10 rounded-md border border-border bg-white px-3 text-sm font-black shadow-soft dark:bg-[#102017]">
          {cities.map((item) => <option key={item} value={item}>{item === "all" ? "Svi gradovi" : item}</option>)}
        </select>
        <div className="absolute inset-0 origin-center transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1100 680" preserveAspectRatio="none">
            <rect width="1100" height="680" fill="#eef4ef" />
            <path d="M-30 534 C190 418 350 510 520 405 S845 305 1140 392" fill="none" stroke="#dbe9dc" strokeWidth="116" />
            <path d="M-30 190 C210 145 300 282 500 252 S810 118 1140 172" fill="none" stroke="#dfe8dd" strokeWidth="86" />
            <path d="M105 690 C215 506 360 430 498 318 S720 185 930 -20" fill="none" stroke="#fff" strokeWidth="28" />
            <path d="M105 690 C215 506 360 430 498 318 S720 185 930 -20" fill="none" stroke="#f0c36a" strokeWidth="10" />
            <path d="M-40 338 C150 290 285 350 425 315 S680 240 905 282 S1050 305 1140 262" fill="none" stroke="#fff" strokeWidth="24" />
            <path d="M-40 338 C150 290 285 350 425 315 S680 240 905 282 S1050 305 1140 262" fill="none" stroke="#9bbca3" strokeWidth="7" />
            <path d="M-20 102 C220 156 345 94 525 158 S790 252 1130 202" fill="none" stroke="#9bd1ee" strokeWidth="20" opacity=".8" />
            {Array.from({ length: 14 }).map((_, index) => <path key={`v-${index}`} d={`M${index * 86} 0 V680`} stroke="#d7e4d8" strokeWidth="1" opacity=".75" />)}
            {Array.from({ length: 10 }).map((_, index) => <path key={`h-${index}`} d={`M0 ${index * 76} H1100`} stroke="#d7e4d8" strokeWidth="1" opacity=".75" />)}
          </svg>
          {visible.map(({ Icon, label, top, left, type: markerType, city: markerCity }) => (
            <div key={`${markerCity}-${label}`} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-black shadow-soft dark:bg-[#102017]" style={{ top: `${top}%`, left: `${left}%` }}>
              <Icon size={16} className={markerType === "animal" ? "text-accent" : "text-primary"} />
              {markerCity} | {label}
            </div>
          ))}
          <div className="absolute bottom-[16%] left-[46%] flex items-center gap-1 rounded-md bg-slate-950 px-3 py-2 text-xs font-black text-white"><MapPin size={16} />BiH marketplace centar</div>
        </div>
      </Card>
    </main>
  );
}
