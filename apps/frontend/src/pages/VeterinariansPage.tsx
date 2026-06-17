import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, Phone, ShieldCheck, Stethoscope, Video } from "lucide-react";
import type { ApiResponse, Veterinarian, VeterinaryStation } from "@farma/shared";
import { api, authApi } from "../lib/api";
import { demoStations, demoVeterinarians } from "../data/demo";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";

function vetName(item: Veterinarian | VeterinaryStation) {
  if ("fullName" in item) return item.fullName;
  if ("full_name" in item) return String((item as unknown as { full_name: string }).full_name);
  return item.name;
}

function itemCity(item: Veterinarian | VeterinaryStation) {
  return "city" in item ? item.city : "";
}

export function VeterinariansPage({ stations = false }: { stations?: boolean }) {
  const { token } = useAuth();
  const { locale } = useI18n();
  const [bookingFor, setBookingFor] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const query = useQuery({
    queryKey: [stations ? "stations" : "veterinarians"],
    queryFn: async () => (await api<ApiResponse<(Veterinarian | VeterinaryStation)[]>>(stations ? "/veterinary-stations" : "/veterinarians")).data,
    retry: 1
  });
  const data = query.data?.length ? query.data : stations ? demoStations : demoVeterinarians;
  const bookText = locale === "bs" ? "Rezervisi" : "Book";
  const callText = locale === "bs" ? "Pozovi" : "Call";
  const onlineText = locale === "bs" ? "Online" : "Online";

  async function book(event: FormEvent<HTMLFormElement>, veterinarianId: string) {
    event.preventDefault();
    if (!token) {
      setStatus("Prijavi se da rezervises termin.");
      return;
    }
    const form = new FormData(event.currentTarget);
    await authApi<ApiResponse<unknown>>("/appointments", token, {
      method: "POST",
      body: JSON.stringify({
        veterinarianId,
        animalId: String(form.get("animalId")),
        scheduledAt: new Date(String(form.get("scheduledAt"))).toISOString(),
        reason: String(form.get("reason")),
        status: "PENDING"
      })
    });
    setStatus("Termin je poslan veterinaru.");
    setBookingFor(null);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">{stations ? "Veterinarske stanice" : "Veterinari"}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Licence, specijalizacije, lokacija, poziv i rezervacija termina.</p>
        </div>
        {status && <div className="rounded-md bg-primary/10 px-3 py-2 text-sm font-black text-primary">{status}</div>}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {data.map((item) => (
          <Card key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">{vetName(item)}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><MapPin size={15} />{itemCity(item)} | Rating {item.rating}</p>
              </div>
              <div className="rounded-md bg-primary/10 p-2 text-primary"><Stethoscope /></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {("specializations" in item ? item.specializations : item.services).map((value) => <span key={value} className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{value}</span>)}
            </div>
            {"licenseNumber" in item || "license_number" in item ? (
              <div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300"><ShieldCheck size={16} className="text-primary" />Licenca: {String((item as unknown as { licenseNumber?: string; license_number?: string }).licenseNumber ?? (item as unknown as { license_number?: string }).license_number)}</div>
            ) : null}
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <Button type="button" onClick={() => setBookingFor(bookingFor === item.id ? null : item.id)}><CalendarDays size={16} />{bookText}</Button>
              <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800" href="tel:+38761111222"><Phone size={16} />{callText}</a>
              <Button type="button" className="bg-accent text-accent-foreground hover:bg-[#e69b21]"><Video size={16} />{onlineText}</Button>
            </div>
            {bookingFor === item.id && !stations && (
              <form className="mt-4 grid gap-3 rounded-md bg-slate-50 p-3 dark:bg-white/5" onSubmit={(event) => book(event, item.id)}>
                <Input name="animalId" placeholder="Animal ID / ID grla" required />
                <Input name="scheduledAt" type="datetime-local" required />
                <Input name="reason" placeholder="Razlog posjete" required />
                <Button>{bookText}</Button>
              </form>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}
