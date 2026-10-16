import { Building2, CalendarCheck2, ChevronRight, Gavel, MapPinned, PawPrint, Search, ShieldCheck, Stethoscope, Tractor } from "lucide-react";
import { Link } from "react-router";
import { Card } from "../components/ui/card";
import { Seo } from "../lib/seo";

const categories = [
  { title: "Stoka i zivotinje", body: "Krave, bikovi, ovce, koze, konji i druga grla sa lokacijom, cijenom i zdravstvenim detaljima.", href: "/listings", Icon: PawPrint, badge: "Najtrazenije" },
  { title: "Farme i zemljiste", body: "Farme, staje, objekti, pasnjaci i kompletna imanja spremna za proizvodnju.", href: "/farms", Icon: Building2, badge: "Nekretnine" },
  { title: "Oprema i traktori", body: "Traktori, prikljucci, alati, masine, hrana i oprema za svakodnevni rad.", href: "/equipment", Icon: Tractor, badge: "Sezona" },
  { title: "Veterinari", body: "Online konsultacije, terenski izlazak, hitne intervencije i specijalizacije po vrstama zivotinja.", href: "/veterinarians", Icon: Stethoscope, badge: "Provjereno" },
  { title: "Veterinarske stanice", body: "Stanice na mapi, radno vrijeme, usluge, laboratorija i hitni kontakt.", href: "/stations", Icon: MapPinned, badge: "Mapa" },
  { title: "Aukcije", body: "Ponude, odbrojavanje, prodaja premium grla i transparentan tok nadmetanja.", href: "/auctions", Icon: Gavel, badge: "Uzivo" }
];

const quickFilters = ["Goveda", "Ovce", "Koze", "Konji", "Traktori", "Staje", "Veterinari", "Hitno"];

export function CategoriesPage() {
  return (
    <main>
      <Seo
        title="Kategorije oglasa | FARMA OGLASI PRO"
        description="Pregled kategorija za stoku, farme, poljoprivrednu opremu, veterinare, veterinarske stanice i aukcije u BiH."
        canonicalPath="/categories"
      />

      <section className="border-b border-border bg-white dark:bg-[#0d1b12]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
          <div>
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-black text-primary">
              <Search size={16} /> Brzi ulaz u trziste
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">
              Pronadji pravu kategoriju prije nego sto krenes u dogovor.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Kategorije su slozene oko stvarnih poslova na farmi: kupovina grla, prodaja opreme, rezervacija veterinara,
              pregled stanica i aukcije za brzu prodaju.
            </p>
          </div>
          <Card className="p-5">
            <div className="flex items-center gap-2 text-lg font-black"><ShieldCheck className="text-primary" /> Popularne pretrage</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <Link key={filter} to={`/listings?q=${encodeURIComponent(filter)}`} className="rounded-md border border-border bg-white px-3 py-2 text-sm font-black text-slate-700 hover:border-primary hover:text-primary dark:bg-[#102017] dark:text-slate-200">
                  {filter}
                </Link>
              ))}
            </div>
            <div className="mt-5 rounded-md bg-accent/20 p-4 text-sm font-bold text-slate-800 dark:text-slate-100">
              Premium pristup pomaze da se kvalitetni oglasi izdvoje u kategorijama i pretrazi.
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map(({ Icon, title, body, href, badge }) => (
            <Link key={title} to={href} className="group block">
              <Card className="h-full p-5 transition group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon size={24} />
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black uppercase text-slate-600 dark:bg-white/10 dark:text-slate-300">{badge}</span>
                </div>
                <h2 className="mt-5 text-xl font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-black text-primary">
                  Otvori kategoriju <ChevronRight size={16} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-white py-8 dark:bg-[#0d1b12]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3">
          {[
            ["Objavi precizno", "Izaberi kategoriju, dodaj lokaciju, cijenu, slike i kontakt."],
            ["Provjeri detalje", "Za zivotinje koristi podatke o rasi, zdravlju, vakcinaciji i dokumentima."],
            ["Rezervisi uslugu", "Veterinari, stanice i termini ostaju povezani sa oglasima i zdravljem grla."]
          ].map(([title, body], index) => (
            <div key={title} className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary text-sm font-black text-white">{index + 1}</div>
              <div>
                <div className="font-black">{title}</div>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
              </div>
            </div>
          ))}
          <Link to="/appointments" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-black text-white md:col-span-3 md:w-fit">
            <CalendarCheck2 size={18} /> Rezervisi termin
          </Link>
        </div>
      </section>
    </main>
  );
}
