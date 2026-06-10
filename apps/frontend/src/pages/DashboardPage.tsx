import { useState, type FormEvent } from "react";
import { Activity, BadgeCheck, Building2, CreditCard, FileText, LineChart, PawPrint, Settings, ShieldAlert, Users } from "lucide-react";
import type { ApiResponse } from "@farma/shared";
import { userRoles } from "@farma/shared";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { authApi } from "../lib/api";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";

type AdminTab = "user" | "station" | "farm" | "animal" | "listing" | "premium";

const tabs: Array<{ id: AdminTab; icon: typeof Users; labelKey: "addUser" | "addStation" | "addFarm" | "addAnimal" | "addListing" | "premiumFull" }> = [
  { id: "user", icon: Users, labelKey: "addUser" },
  { id: "station", icon: Building2, labelKey: "addStation" },
  { id: "farm", icon: Building2, labelKey: "addFarm" },
  { id: "animal", icon: PawPrint, labelKey: "addAnimal" },
  { id: "listing", icon: FileText, labelKey: "addListing" },
  { id: "premium", icon: CreditCard, labelKey: "premiumFull" }
];

function asJson(form: HTMLFormElement) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function Field({ label, name, type = "text", defaultValue, required = true }: { label: string; name: string; type?: string; defaultValue?: string; required?: boolean }) {
  return (
    <label className="grid gap-1 text-sm font-bold">
      {label}
      <Input name={name} type={type} defaultValue={defaultValue} required={required} />
    </label>
  );
}

export function DashboardPage() {
  const { token, user } = useAuth();
  const { t } = useI18n();
  const [tab, setTab] = useState<AdminTab>("user");
  const [status, setStatus] = useState("");

  async function submit(path: string, body: Record<string, unknown>) {
    if (!token) {
      setStatus("Login as admin first.");
      return;
    }
    await authApi<ApiResponse<unknown>>(path, token, { method: "POST", body: JSON.stringify(body) });
    setStatus(t.saved);
  }

  async function handleUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit("/admin/users", asJson(event.currentTarget));
    event.currentTarget.reset();
  }

  async function handleStation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = asJson(event.currentTarget);
    await submit("/admin/veterinary-stations", { ...body, services: String(body.services).split(",").map((item) => item.trim()).filter(Boolean) });
    event.currentTarget.reset();
  }

  async function handleFarm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit("/admin/farms", asJson(event.currentTarget));
    event.currentTarget.reset();
  }

  async function handleAnimal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit("/admin/animals", asJson(event.currentTarget));
    event.currentTarget.reset();
  }

  async function handleListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = asJson(event.currentTarget);
    await submit("/admin/listings", { ...body, currency: "BAM", featured: body.featured === "on", urgent: body.urgent === "on", vaccinated: body.vaccinated === "on", pedigree: body.pedigree === "on" });
    event.currentTarget.reset();
  }

  async function handlePremium(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit("/admin/premium", asJson(event.currentTarget));
    event.currentTarget.reset();
  }

  const stats = [
    { Icon: Users, title: "Users", body: "Roles, verification, breeder and vet approvals" },
    { Icon: FileText, title: "Listings", body: "Create, renew, featured and urgent marketplace inventory" },
    { Icon: CreditCard, title: "Premium", body: "Premium Full: 10 KM monthly, verified and featured visibility" },
    { Icon: LineChart, title: "Analytics", body: "Views, favorites, revenue, conversions and breeds" },
    { Icon: Activity, title: "Reports", body: "Fraud, spam, disputes and audit log workflow" },
    { Icon: Settings, title: "SEO", body: "Meta, sitemap, schema, OG and local search signals" }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">{t.adminDashboard}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user ? `${user.email} · ${user.role}` : "Login required"}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md bg-accent/20 px-3 py-2 text-sm font-black"><BadgeCheck size={16} />{t.premiumFull}: 10 KM / mjesec</div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ Icon, title, body }) => (
          <Card key={title} className="p-5">
            <Icon className="text-primary" />
            <h2 className="mt-3 text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
          </Card>
        ))}
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card className="p-3">
          <div className="space-y-2">
            {tabs.map(({ id, icon: Icon, labelKey }) => (
              <button key={id} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-black ${tab === id ? "bg-primary text-white" : "hover:bg-primary/10"}`} onClick={() => setTab(id)}>
                <Icon size={17} />{t[labelKey]}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          {!token && <div className="mb-4 flex items-center gap-2 rounded-md bg-danger/10 p-3 text-sm font-bold text-danger"><ShieldAlert size={18} />Login as superadmin/admin to save data.</div>}
          {status && <div className="mb-4 rounded-md bg-primary/10 p-3 text-sm font-bold text-primary">{status}</div>}

          {tab === "user" && (
            <form className="grid gap-3 md:grid-cols-2" onSubmit={handleUser}>
              <Field label={t.email} name="email" type="email" />
              <Field label={t.password} name="password" defaultValue="Password123!" />
              <Field label={t.fullName} name="fullName" />
              <Field label={t.phone} name="phone" required={false} />
              <label className="grid gap-1 text-sm font-bold">{t.role}<select name="role" className="h-10 rounded-md border border-border bg-white px-3 dark:bg-[#102017]">{userRoles.map((role) => <option key={role}>{role}</option>)}</select></label>
              <Field label={t.city} name="city" defaultValue="Sarajevo" required={false} />
              <Button className="md:col-span-2">{t.save}</Button>
            </form>
          )}

          {tab === "station" && (
            <form className="grid gap-3 md:grid-cols-2" onSubmit={handleStation}>
              <Field label={t.name} name="name" defaultValue="Nova veterinarska stanica" />
              <Field label={t.city} name="city" defaultValue="Sarajevo" />
              <Field label="Address" name="address" defaultValue="Adresa 1" />
              <Field label="Latitude" name="latitude" defaultValue="43.8563" />
              <Field label="Longitude" name="longitude" defaultValue="18.4131" />
              <Field label="Services comma-separated" name="services" defaultValue="Vakcinacija,Hitne intervencije,Terenski izlazak" />
              <Field label="Opening hours" name="openingHours" defaultValue="08:00-18:00" />
              <Field label="Emergency contact" name="emergencyContact" defaultValue="+38761111222" />
              <Button className="md:col-span-2">{t.save}</Button>
            </form>
          )}

          {tab === "farm" && (
            <form className="grid gap-3 md:grid-cols-2" onSubmit={handleFarm}>
              <Field label={t.ownerId} name="ownerId" />
              <Field label={t.name} name="name" defaultValue="Nova farma" />
              <Field label={t.city} name="city" defaultValue="Travnik" />
              <Field label="Latitude" name="latitude" defaultValue="44.226" required={false} />
              <Field label="Longitude" name="longitude" defaultValue="17.665" required={false} />
              <label className="grid gap-1 text-sm font-bold md:col-span-2">{t.description}<textarea name="description" className="min-h-24 rounded-md border border-border bg-white p-3 dark:bg-[#102017]" defaultValue="Porodicna farma sa kvalitetnim uzgojem i urednom dokumentacijom." required /></label>
              <Button className="md:col-span-2">{t.save}</Button>
            </form>
          )}

          {tab === "animal" && (
            <form className="grid gap-3 md:grid-cols-2" onSubmit={handleAnimal}>
              <Field label={t.ownerId} name="ownerId" />
              <Field label="Farm ID" name="farmId" required={false} />
              <Field label={t.name} name="name" defaultValue="Novo grlo" required={false} />
              <Field label={t.animalId} name="animalId" defaultValue={`BA-AN-${Date.now()}`} />
              <Field label="Microchip" name="microchipNumber" required={false} />
              <Field label={t.category} name="category" defaultValue="CATTLE" />
              <Field label={t.breed} name="breed" defaultValue="Simental" />
              <Field label="Birth date" name="birthDate" type="date" required={false} />
              <Field label="Weight kg" name="weightKg" defaultValue="350" required={false} />
              <Field label="Health status" name="healthStatus" defaultValue="Healthy" />
              <Button className="md:col-span-2">{t.save}</Button>
            </form>
          )}

          {tab === "listing" && (
            <form className="grid gap-3 md:grid-cols-2" onSubmit={handleListing}>
              <Field label={t.ownerId} name="ownerId" />
              <Field label="Title" name="title" defaultValue="Admin oglas - kvalitetno grlo" />
              <Field label={t.price} name="price" defaultValue="2500" />
              <Field label="Type" name="type" defaultValue="ANIMAL" />
              <Field label={t.category} name="category" defaultValue="CATTLE" />
              <Field label={t.breed} name="breed" defaultValue="Simental" required={false} />
              <Field label="Gender" name="gender" defaultValue="FEMALE" required={false} />
              <Field label="Age months" name="ageMonths" defaultValue="18" required={false} />
              <Field label="Weight kg" name="weightKg" defaultValue="420" required={false} />
              <Field label="Color" name="color" defaultValue="Smedja" required={false} />
              <Field label={t.location} name="location" defaultValue="Travnik" />
              <Field label={t.phone} name="phone" defaultValue="+38761111222" required={false} />
              <label className="flex items-center gap-2 text-sm font-bold"><input name="featured" type="checkbox" />{t.featured}</label>
              <label className="flex items-center gap-2 text-sm font-bold"><input name="urgent" type="checkbox" />{t.urgent}</label>
              <label className="grid gap-1 text-sm font-bold md:col-span-2">{t.description}<textarea name="description" className="min-h-24 rounded-md border border-border bg-white p-3 dark:bg-[#102017]" defaultValue="Detaljan admin oglas sa provjerenim informacijama i kontakt podacima." required /></label>
              <Button className="md:col-span-2">{t.save}</Button>
            </form>
          )}

          {tab === "premium" && (
            <form className="grid gap-3 md:grid-cols-2" onSubmit={handlePremium}>
              <div className="md:col-span-2 rounded-md bg-accent/20 p-4 text-sm font-bold">{t.premiumBenefits}</div>
              <Field label="User ID" name="userId" />
              <Field label="Months" name="months" type="number" defaultValue="1" />
              <Field label="Provider" name="provider" defaultValue="MANUAL_ADMIN" />
              <Button className="md:col-span-2">{t.activatePremium}</Button>
            </form>
          )}
        </Card>
      </section>
    </main>
  );
}
