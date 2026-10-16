import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Activity, ArrowRight, CalendarDays, Crown, Gauge, MessageSquareText, Search, Sparkles, Stethoscope, TrendingUp } from "lucide-react";
import type { ApiResponse, Listing } from "@farma/shared";
import { api } from "../lib/api";
import { demoListings, demoStations, demoVeterinarians } from "../data/demo";
import { ListingCard } from "../components/ListingCard";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { MapPanel } from "../components/MapPanel";
import { Seo } from "../lib/seo";
import { useI18n } from "../i18n";

export function HomePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const listings = useQuery({
    queryKey: ["listings", "featured"],
    queryFn: async () => (await api<ApiResponse<Listing[]>>("/listings?featured=true")).data,
    retry: 1
  });
  const activeListings = listings.data?.length ? listings.data : demoListings;
  const featureCards = [
    { Icon: Stethoscope, title: t.veterinarians, label: `${demoVeterinarians.length} dostupna`, body: "Terenski izlazak, konsultacije i hitne intervencije." },
    { Icon: CalendarDays, title: t.bookAppointment, label: "Podsjetnici", body: "Zivotinja, veterinar, datum, vrijeme i razlog na jednom mjestu." },
    { Icon: Activity, title: t.healthTimeline, label: "QR karton", body: "Vakcinacije, tretmani, biljeske i dokumenti kroz historiju grla." },
    { Icon: TrendingUp, title: t.priceIndex, label: "Trziste", body: "Popularne rase, pregledi, cijene i premium vidljivost." }
  ];

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/listings?q=${encodeURIComponent(query)}` : "/listings");
  }

  return (
    <main>
      <Seo
        title="FARMA OGLASI PRO | Stoka, farme, oprema i veterinari u BiH"
        description="Najveci marketplace za stoku, farme, poljoprivrednu opremu, veterinare, veterinarske stanice i aukcije u Bosni i Hercegovini."
      />

      <section className="border-b border-border bg-white hero-surface dark:bg-[#0d1b12]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-12">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-black text-primary">
              <Sparkles size={16} /> AI pretraga + provjereni prodavci
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">{t.heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">{t.heroSubtitle}</p>
            <form className="mt-6 grid max-w-2xl gap-2 sm:grid-cols-[1fr_auto]" onSubmit={submitSearch}>
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchPlaceholder} className="h-11" />
              <Button className="h-11"><Search size={18} />{t.search}</Button>
            </form>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Goveda", "Traktori", "Farme", "Veterinari"].map((term) => (
                <Link key={term} to={`/listings?q=${encodeURIComponent(term)}`} className="rounded-md border border-border bg-white/80 px-3 py-2 text-sm font-bold text-slate-700 hover:border-primary hover:text-primary dark:bg-white/5 dark:text-slate-200">
                  {term}
                </Link>
              ))}
            </div>
            <div className="mt-6 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["300+", "Oglasa"],
                ["100", "Grla"],
                ["20", "Veterinara"],
                ["10", "Stanica"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-border bg-white/70 p-3 dark:bg-white/5">
                  <div className="text-2xl font-black text-primary">{value}</div>
                  <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-lg border border-border bg-slate-100 shadow-soft dark:bg-[#102017]">
              <img src="/farma-hero-pro.png" alt="Farma, stoka, oprema i veterinarske usluge" className="aspect-[16/9] w-full object-cover" />
            </div>
            <MapPanel compact />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-slate-950 py-8 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-center">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-black text-slate-950"><Crown size={16} /> Premium paket</div>
            <h2 className="text-3xl font-black md:text-4xl">Premium pristup za 5 KM mjesecno</h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-300">Izdvojeni oglasi, analitika, verifikovana oznaka, AI opisi, prioritet u pretrazi i veca vidljivost za prodaju stoke, farmi i opreme.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/premium" className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-black text-white shadow-soft hover:bg-[#256b2a]">
                {t.fullAccess} <ArrowRight size={17} />
              </Link>
              <Link to="/about" className="inline-flex h-11 w-fit items-center justify-center rounded-md border border-white/20 px-5 text-sm font-black text-white hover:bg-white/10">
                O platformi
              </Link>
            </div>
          </div>
          <img src="/marketing-marketplace.png" alt="FARMA OGLASI PRO premium prikaz" className="min-h-72 w-full rounded-lg object-cover shadow-soft" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">{t.featured}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Aktuelni oglasi sa najvise signala za kupce.</p>
          </div>
          <Link to="/listings" className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">{t.viewAll}</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      </section>

      <section className="border-y border-border bg-white py-8 dark:bg-[#0d1b12]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map(({ Icon, title, label, body }) => (
            <Card key={title} className="p-5">
              <Icon className="text-primary" />
              <div className="mt-3 text-lg font-black">{title}</div>
              <div className="text-sm font-bold text-accent">{label}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xl font-black"><Stethoscope className="text-primary" />Top veterinari</div>
          <div className="mt-4 space-y-3">
            {demoVeterinarians.map((vet) => (
              <div key={vet.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-3">
                <span className="font-bold">{vet.fullName}</span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{vet.city} | {vet.rating}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xl font-black"><MessageSquareText className="text-primary" />Marketplace uzivo</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border p-3"><Gauge className="text-accent" /><div className="mt-2 font-bold">Aukcije</div><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Odbrojavanje, ponude, auto bid i tok pobjednika.</p></div>
            <div className="rounded-md border border-border p-3"><Activity className="text-accent" /><div className="mt-2 font-bold">Stanice</div><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{demoStations.length} mapirane stanice sa hitnim kontaktima.</p></div>
          </div>
        </Card>
      </section>
    </main>
  );
}
