import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Activity, CalendarDays, Crown, Gauge, MessageSquareText, Search, Sparkles, Stethoscope, TrendingUp } from "lucide-react";
import type { ApiResponse, Listing } from "@farma/shared";
import { api } from "../lib/api";
import { demoListings, demoStations, demoVeterinarians } from "../data/demo";
import { ListingCard } from "../components/ListingCard";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { MapPanel } from "../components/MapPanel";
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
    { Icon: Stethoscope, title: t.veterinarians, label: `${demoVeterinarians.length} online`, body: "Emergency, field visits, consultations" },
    { Icon: CalendarDays, title: t.bookAppointment, label: "Reminders", body: "Animal, vet, date, time and reason" },
    { Icon: Activity, title: t.healthTimeline, label: "QR passports", body: "Vaccines, treatments, notes and documents" },
    { Icon: TrendingUp, title: t.priceIndex, label: "Market trends", body: "Popular breeds, views and revenue" }
  ];

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/listings?q=${encodeURIComponent(query)}` : "/listings");
  }

  return (
    <main>
      <section className="border-b border-border bg-white hero-surface dark:bg-[#0d1b12]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-bold text-primary"><Sparkles size={16} />AI smart search + verified sellers</div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-6xl">{t.heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{t.heroSubtitle}</p>
            <form className="mt-6 flex max-w-2xl gap-2" onSubmit={submitSearch}>
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchPlaceholder} />
              <Button><Search size={18} />{t.search}</Button>
            </form>
            <div className="mt-6 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["300+", "Listings"],
                ["100", "Animals"],
                ["20", "Vets"],
                ["10", "Stations"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-border p-3">
                  <div className="text-2xl font-black text-primary">{value}</div>
                  <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <img src="/farma-hero-pro.png" alt="Farma, stoka, oprema i veterinarske usluge" className="w-full rounded-md border border-border object-cover shadow-soft" />
            <MapPanel compact />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-slate-950 py-8 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-black text-slate-950"><Crown size={16} />Premium marketplace</div>
            <h2 className="text-3xl font-black md:text-4xl">Full Access za 5 KM mjesecno</h2>
            <p className="mt-3 max-w-xl text-slate-300">Izdvojeni oglasi, analitika, verified badge, AI opisi, prioritet u pretrazi i veca vidljivost za prodaju stoke, farmi i opreme.</p>
            <Link to="/premium" className="mt-5 inline-flex h-11 w-fit items-center justify-center rounded-md bg-primary px-5 text-sm font-black text-white shadow-soft hover:bg-[#256b2a]">{t.fullAccess}</Link>
          </div>
          <img src="/marketing-marketplace.png" alt="FARMA OGLASI PRO marketing prikaz" className="min-h-72 w-full rounded-md object-cover shadow-soft" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black">{t.featured}</h2>
          <Link to="/listings" className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">{t.viewAll}</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      </section>

      <section className="border-y border-border bg-white py-8 dark:bg-[#0d1b12]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 lg:grid-cols-4">
          {featureCards.map(({ Icon, title, label, body }) => (
            <Card key={title} className="p-5">
              <Icon className="text-primary" />
              <div className="mt-3 text-lg font-black">{title}</div>
              <div className="text-sm font-bold text-accent">{label}</div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xl font-black"><Stethoscope className="text-primary" />Top veterinarians</div>
          <div className="mt-4 space-y-3">
            {demoVeterinarians.map((vet) => <div key={vet.id} className="flex items-center justify-between rounded-md border border-border p-3"><span className="font-bold">{vet.fullName}</span><span className="text-sm text-slate-600">{vet.city} · {vet.rating}</span></div>)}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xl font-black"><MessageSquareText className="text-primary" />Realtime marketplace</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border p-3"><Gauge className="text-accent" /><div className="mt-2 font-bold">Auctions</div><p className="text-sm text-slate-600">Countdown, bids, auto bid, winner flow.</p></div>
            <div className="rounded-md border border-border p-3"><Activity className="text-accent" /><div className="mt-2 font-bold">Stations</div><p className="text-sm text-slate-600">{demoStations.length} mapped stations with emergency contacts.</p></div>
          </div>
        </Card>
      </section>
    </main>
  );
}
