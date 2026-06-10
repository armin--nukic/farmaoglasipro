import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Phone, Stethoscope, Video } from "lucide-react";
import type { ApiResponse, Veterinarian, VeterinaryStation } from "@farma/shared";
import { api } from "../lib/api";
import { demoStations, demoVeterinarians } from "../data/demo";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function VeterinariansPage({ stations = false }: { stations?: boolean }) {
  const query = useQuery({
    queryKey: [stations ? "stations" : "veterinarians"],
    queryFn: async () => (await api<ApiResponse<(Veterinarian | VeterinaryStation)[]>>(stations ? "/veterinary-stations" : "/veterinarians")).data,
    retry: 1
  });
  const data = query.data?.length ? query.data : stations ? demoStations : demoVeterinarians;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black">{stations ? "Veterinary stations" : "Veterinarians"}</h1>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {data.map((item) => (
          <Card key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">{"fullName" in item ? item.fullName : item.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{"city" in item ? item.city : ""} · Rating {item.rating}</p>
              </div>
              <Stethoscope className="text-primary" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {("specializations" in item ? item.specializations : item.services).map((value) => <span key={value} className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{value}</span>)}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <Button><CalendarDays size={16} />Book</Button>
              <Button className="bg-slate-950 hover:bg-slate-800"><Phone size={16} />Call</Button>
              <Button className="bg-accent text-accent-foreground hover:bg-[#e69b21]"><Video size={16} />Online</Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
