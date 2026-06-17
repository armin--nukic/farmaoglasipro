import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, CheckCircle2, ClipboardPlus, Crown, Eye, PackagePlus } from "lucide-react";
import type { ApiResponse, Listing, ListingType } from "@farma/shared";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { api, authApi } from "../lib/api";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";

const listingTypes: Array<{ value: ListingType; labelBs: string; labelEn: string }> = [
  { value: "ANIMAL", labelBs: "Zivotinja / grlo", labelEn: "Animal" },
  { value: "EQUIPMENT", labelBs: "Oprema", labelEn: "Equipment" },
  { value: "REAL_ESTATE", labelBs: "Farma / zemljiste", labelEn: "Farm / land" },
  { value: "AGRICULTURE", labelBs: "Poljoprivreda", labelEn: "Agriculture" }
];

function value(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export function CreateListingPage() {
  const { token, user } = useAuth();
  const { locale, t } = useI18n();
  const navigate = useNavigate();
  const [type, setType] = useState<ListingType>("ANIMAL");
  const [customCategory, setCustomCategory] = useState("");
  const [status, setStatus] = useState("");
  const categories = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => (await api<ApiResponse<Array<{ id: string; name: string; type: ListingType }>>>(`/categories?type=${type}`)).data,
    retry: 1
  });
  const benefitCards = [
    { Icon: Crown, title: t.fullAccess, body: t.premiumBenefits },
    { Icon: BarChart3, title: t.analytics, body: "Pregledi, favoriti, konverzije i popularne kategorije." },
    { Icon: Eye, title: t.availability, body: "Oglas je javno vidljiv odmah nakon objave." },
    { Icon: CheckCircle2, title: "SEO", body: "Naslov, lokacija i kategorija ulaze u pretragu." }
  ];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    if (!token) {
      setStatus("Login required / Potrebna je prijava.");
      navigate("/login");
      return;
    }
    const form = new FormData(event.currentTarget);
    const payload = {
      title: value(form, "title"),
      description: value(form, "description"),
      price: Number(value(form, "price")),
      currency: "BAM",
      type,
      category: customCategory.trim() || value(form, "category"),
      breed: value(form, "breed") || undefined,
      gender: value(form, "gender") || undefined,
      ageMonths: value(form, "ageMonths") ? Number(value(form, "ageMonths")) : undefined,
      weightKg: value(form, "weightKg") ? Number(value(form, "weightKg")) : undefined,
      color: value(form, "color") || undefined,
      location: value(form, "location"),
      healthStatus: value(form, "healthStatus") || undefined,
      phone: value(form, "phone") || undefined,
      whatsapp: value(form, "whatsapp") || undefined,
      featured: form.get("featured") === "on",
      urgent: form.get("urgent") === "on",
      vaccinated: form.get("vaccinated") === "on",
      pedigree: form.get("pedigree") === "on"
    };
    try {
      const response = await authApi<ApiResponse<Listing>>("/listings", token, { method: "POST", body: JSON.stringify(payload) });
      setStatus(`${t.saved}: ${response.data.title}`);
      event.currentTarget.reset();
      setType("ANIMAL");
      setCustomCategory("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Objava nije uspjela. Provjeri obavezna polja.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-black"><ClipboardPlus className="text-primary" />{t.publishListing}</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user ? `${t.loggedInAs}: ${user.fullName} (${user.role})` : "Login required"}</p>
            </div>
            <span className="rounded-md bg-accent/20 px-3 py-2 text-sm font-black">{t.fullAccess}: 5 KM / mjesec</span>
          </div>

          {status && <div className="mb-4 rounded-md bg-primary/10 p-3 text-sm font-bold text-primary">{status}</div>}

          <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <label className="grid gap-1 text-sm font-bold md:col-span-2">
              {t.listingType}
              <div className="grid gap-2 sm:grid-cols-4">
                {listingTypes.map((item) => (
                  <button type="button" key={item.value} onClick={() => setType(item.value)} className={`rounded-md border p-3 text-left text-sm font-black ${type === item.value ? "border-primary bg-primary text-white" : "border-border bg-white dark:bg-[#102017]"}`}>
                    {locale === "bs" ? item.labelBs : item.labelEn}
                  </button>
                ))}
              </div>
            </label>

            <label className="grid gap-1 text-sm font-bold md:col-span-2">{t.title}<Input name="title" required placeholder="Simental junica / IMT 539 / Farma sa stajom" /></label>
            <label className="grid gap-1 text-sm font-bold">{t.price}<Input name="price" type="number" min="0" required placeholder="2500" /></label>
            <label className="grid gap-1 text-sm font-bold">
              {t.category}
              <select name="category" className="h-10 rounded-md border border-border bg-white px-3 dark:bg-[#102017]" disabled={Boolean(customCategory)}>
                {(categories.data?.length ? categories.data : []).map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
                {!categories.data?.length && <option>{type === "ANIMAL" ? "Cattle" : type === "EQUIPMENT" ? "Tractors" : type === "REAL_ESTATE" ? "Farms" : "Hay"}</option>}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Dodatna kategorija
              <Input value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} placeholder="npr. Alpaka, Solarni pastir, Sjenik" />
            </label>
            <label className="grid gap-1 text-sm font-bold">{t.location}<Input name="location" required placeholder="Travnik" /></label>
            <label className="grid gap-1 text-sm font-bold">{t.phone}<Input name="phone" placeholder="+38761111222" /></label>

            {type === "ANIMAL" && (
              <>
                <label className="grid gap-1 text-sm font-bold">{t.breed}<Input name="breed" placeholder="Simental" /></label>
                <label className="grid gap-1 text-sm font-bold">Spol<select name="gender" className="h-10 rounded-md border border-border bg-white px-3 dark:bg-[#102017]"><option value="FEMALE">Zensko</option><option value="MALE">Musko</option><option value="MIXED">Mijesano</option><option value="UNKNOWN">Nepoznato</option></select></label>
                <label className="grid gap-1 text-sm font-bold">Starost u mjesecima<Input name="ageMonths" type="number" min="0" placeholder="18" /></label>
                <label className="grid gap-1 text-sm font-bold">Tezina kg<Input name="weightKg" type="number" min="0" placeholder="420" /></label>
                <label className="grid gap-1 text-sm font-bold">Boja<Input name="color" placeholder="Smedja" /></label>
                <label className="grid gap-1 text-sm font-bold">Zdravstveno stanje<Input name="healthStatus" placeholder="Zdravo, vakcinisano, uredni papiri" /></label>
              </>
            )}

            <label className="grid gap-1 text-sm font-bold md:col-span-2">{t.description}<textarea name="description" required minLength={20} className="min-h-28 rounded-md border border-border bg-white p-3 dark:bg-[#102017]" placeholder="Detaljan opis od najmanje 20 karaktera: dokumenti, stanje, transport, kontakt..." /></label>

            <div className="flex flex-wrap gap-4 text-sm font-bold md:col-span-2">
              <label className="flex items-center gap-2"><input name="featured" type="checkbox" />{t.featured}</label>
              <label className="flex items-center gap-2"><input name="urgent" type="checkbox" />{t.urgent}</label>
              <label className="flex items-center gap-2"><input name="vaccinated" type="checkbox" />Vakcinisano</label>
              <label className="flex items-center gap-2"><input name="pedigree" type="checkbox" />Pedigree</label>
            </div>

            <Button className="md:col-span-2"><PackagePlus size={18} />{t.publishListing}</Button>
          </form>
        </Card>

        <aside className="space-y-4">
          {benefitCards.map(({ Icon, title, body }) => (
            <Card key={title} className="p-4">
              <Icon className="text-primary" />
              <div className="mt-2 font-black">{title}</div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{body}</p>
            </Card>
          ))}
        </aside>
      </div>
    </main>
  );
}
