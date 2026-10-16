import { CalendarDays, ClipboardPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Seo } from "../lib/seo";

export function AppointmentsPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <Seo
        title="Rezervacija veterinara | FARMA OGLASI PRO"
        description="Rezervisite veterinarski termin, pratite tretmane, vakcinacije, recepte i zdravstveni karton zivotinje."
        canonicalPath="/appointments"
      />
      <Card className="p-5">
        <h1 className="flex items-center gap-2 text-2xl font-black"><CalendarDays className="text-primary" />Rezervisi veterinarski termin</h1>
        <div className="mt-5 space-y-3">
          <Input placeholder="ID veterinara" />
          <Input placeholder="ID zivotinje" />
          <Input type="datetime-local" />
          <Input placeholder="Razlog dolaska" />
          <Button className="w-full">Kreiraj termin</Button>
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-2xl font-black"><ClipboardPlus className="text-primary" />Zdravstveni karton zivotinje</h2>
        <div className="mt-5 space-y-3">
          {["Naredna vakcinacija", "Izvjestaj tretmana", "Veterinarska biljeska", "Recept", "QR pasos zivotinje"].map((item) => (
            <div key={item} className="rounded-md border border-border p-3 font-semibold">{item}</div>
          ))}
        </div>
      </Card>
    </main>
  );
}
