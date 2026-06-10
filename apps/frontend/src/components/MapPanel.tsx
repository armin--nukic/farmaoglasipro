import { MapPin } from "lucide-react";
import { Card } from "./ui/card";

export function MapPanel() {
  const markers = [
    { top: "34%", left: "55%", label: "Sarajevo" },
    { top: "21%", left: "34%", label: "Banja Luka" },
    { top: "48%", left: "28%", label: "Livno" },
    { top: "27%", left: "63%", label: "Tuzla" }
  ];

  return (
    <Card className="leaflet-placeholder relative min-h-[360px] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_40%,rgba(249,168,37,0.18),transparent_34%)]" />
      {markers.map((marker) => (
        <div key={marker.label} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-bold shadow-soft" style={{ top: marker.top, left: marker.left }}>
          <MapPin size={14} className="text-primary" />{marker.label}
        </div>
      ))}
      <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white/90 p-4 shadow-soft backdrop-blur">
        <div className="text-sm font-bold">OpenStreetMap ready layer</div>
        <p className="mt-1 text-sm text-slate-600">Listings, farms, veterinarians and stations use latitude/longitude fields and can be rendered with Leaflet or MapLibre.</p>
      </div>
    </Card>
  );
}
