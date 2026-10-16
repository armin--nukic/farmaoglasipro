import { Clock3, Mail, MapPin, MessageSquareText, Phone, Send, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Seo } from "../lib/seo";

const contactCards = [
  { Icon: Phone, title: "Telefon", value: "+387 61 000 000", body: "Podrska za oglase, verifikaciju i premium paket." },
  { Icon: Mail, title: "Email", value: "podrska@farma-oglasipro.ba", body: "Odgovaramo na upite za saradnju i tehnicka pitanja." },
  { Icon: MapPin, title: "Trziste", value: "Bosna i Hercegovina", body: "Fokus na farme, veterinare, opremu i kupce u BiH." }
];

export function ContactPage() {
  return (
    <main>
      <Seo
        title="Kontakt | FARMA OGLASI PRO"
        description="Kontaktirajte FARMA OGLASI PRO za podrsku oko oglasa, premium paketa, verifikacije prodavaca, veterinara i farmi."
        canonicalPath="/contact"
      />

      <section className="border-b border-border bg-white dark:bg-[#0d1b12]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-black text-primary">
              <MessageSquareText size={16} /> Kontakt i podrska
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">
              Javi nam se za oglase, verifikaciju, premium ili saradnju.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Ako treba pomoc oko objave oglasa, rezervacije veterinara, prikaza farme ili premium vidljivosti, posalji upit i dobit ces konkretan odgovor.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2"><Clock3 size={16} /> Radni dani 08:00-17:00</span>
              <span className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2"><ShieldCheck size={16} /> Provjera profila i oglasa</span>
            </div>
          </div>

          <Card className="p-5">
            <form className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Ime i prezime" />
                <Input placeholder="Telefon ili email" />
              </div>
              <Input placeholder="Tema upita" />
              <textarea className="min-h-36 rounded-md border border-border bg-white px-3 py-3 text-sm outline-none ring-primary/20 transition focus:ring-4 dark:bg-[#102017]" placeholder="Napisite sta vam treba..." />
              <Button type="button" className="h-11 w-full sm:w-fit"><Send size={18} />Posalji upit</Button>
            </form>
          </Card>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-3">
        {contactCards.map(({ Icon, title, value, body }) => (
          <Card key={title} className="p-5">
            <Icon className="text-primary" />
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <div className="mt-1 font-black text-primary">{value}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
