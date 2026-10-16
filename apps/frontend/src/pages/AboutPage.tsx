import { Award, CheckCircle2, HeartHandshake, MapPin, ShieldCheck, Stethoscope, TrendingUp, UsersRound } from "lucide-react";
import { Link } from "react-router";
import { Card } from "../components/ui/card";
import { Seo } from "../lib/seo";

const values = [
  { Icon: ShieldCheck, title: "Provjereni oglasi", body: "Profil prodavca, istaknuti oglasi i jasni kontakti pomazu kupcima da brze donesu odluku." },
  { Icon: Stethoscope, title: "Veterinarska mreza", body: "Termin, terenski izlazak, zdravstvena historija i stanice povezani su sa marketplace tokom." },
  { Icon: TrendingUp, title: "Pametnija prodaja", body: "Premium alati, analitika i AI opisi daju bolju vidljivost kvalitetnim farmama i opremi." }
];

const numbers = [
  ["300+", "aktivnih oglasa"],
  ["20", "veterinara"],
  ["10", "stanica"],
  ["5 KM", "Premium mjesecno"]
];

export function AboutPage() {
  return (
    <main>
      <Seo
        title="O nama | FARMA OGLASI PRO"
        description="FARMA OGLASI PRO povezuje uzgajivace, farme, kupce, veterinare i dobavljace opreme u Bosni i Hercegovini."
        canonicalPath="/about"
      />

      <section className="border-b border-border bg-white dark:bg-[#0d1b12]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-black text-primary">
              <HeartHandshake size={16} /> Trziste za teren
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">
              Gradimo pouzdan digitalni prostor za farme, stoku i veterinarske usluge.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              FARMA OGLASI PRO je platforma za ljude koji rade sa zivotinjama, zemljom i opremom svaki dan. Cilj je jednostavan:
              manje izgubljenih poziva, vise provjerenih informacija i brzi put od oglasa do dogovora.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/create-listing" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-black text-white shadow-soft hover:bg-[#256b2a]">
                Objavi oglas
              </Link>
              <Link to="/categories" className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-white px-5 text-sm font-black dark:bg-[#102017]">
                Pregled kategorija
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-slate-100 shadow-soft dark:bg-[#102017]">
            <img src="/farma-marketing-pro.png" alt="FARMA OGLASI PRO platforma" className="h-full min-h-[360px] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {numbers.map(([value, label]) => (
            <Card key={label} className="p-5">
              <div className="text-3xl font-black text-primary">{value}</div>
              <div className="mt-1 text-sm font-bold uppercase text-slate-500 dark:text-slate-300">{label}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-white py-8 dark:bg-[#0d1b12]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 lg:grid-cols-3">
          {values.map(({ Icon, title, body }) => (
            <Card key={title} className="p-5">
              <Icon className="text-primary" />
              <h2 className="mt-4 text-xl font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xl font-black"><Award className="text-accent" /> Sta platforma rjesava</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {["Kupci lakse porede oglase i lokacije.", "Prodavci dobijaju bolju prezentaciju stoke, farmi i opreme.", "Veterinari i stanice postaju vidljiv dio kupovine i njege zivotinja."].map((item) => (
              <div key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-xl font-black"><MapPin className="text-primary" /> Fokus na BiH trziste</div>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Platforma je prilagodjena lokalnim navikama: direktan kontakt, jasna lokacija, istaknuta hitnost oglasa, rezervacija termina i premium paket
            koji ostaje pristupacan manjim farmama.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-md bg-primary/10 p-3 text-sm font-black text-primary">
            <UsersRound size={18} /> Uzgajivaci, veterinari, kupci i dobavljaci na jednom mjestu.
          </div>
        </Card>
      </section>
    </main>
  );
}
