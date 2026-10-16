import { useState } from "react";
import { BadgeCheck, Bot, Crown, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import type { ApiResponse } from "@farma/shared";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { authApi } from "../lib/api";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";
import { Seo } from "../lib/seo";

export function PremiumPage() {
  const { token } = useAuth();
  const { t } = useI18n();
  const [status, setStatus] = useState("");

  async function startTrial() {
    if (!token) {
      setStatus("Prijavi se da aktiviras trial.");
      return;
    }
    await authApi<ApiResponse<unknown>>("/payments/premium/trial", token, { method: "POST", body: "{}" });
    setStatus("Trial aktiviran: 14 dana Full Access.");
  }

  async function checkout() {
    if (!token) {
      setStatus("Prijavi se da pokrenes placanje.");
      return;
    }
    const response = await authApi<ApiResponse<{ checkoutUrl: string; message: string }>>("/payments/premium/checkout", token, { method: "POST", body: JSON.stringify({ provider: "MONRI", months: 1 }) });
    setStatus(`${response.data.message} URL: ${response.data.checkoutUrl}`);
  }

  const features = [
    { Icon: Crown, title: "Izdvojeni oglasi", body: "Veca vidljivost u pretrazi i na naslovnoj." },
    { Icon: LineChart, title: t.analytics, body: "Pregledi, favoriti, dostupnost i konverzije." },
    { Icon: Bot, title: "AI opisi", body: "Premium korisnici dobijaju AI generisanje opisa oglasa." },
    { Icon: ShieldCheck, title: "Verifikovana oznaka", body: "Jasniji signal kupcima da je profil provjeren." }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Seo
        title="Premium paket 5 KM mjesecno | FARMA OGLASI PRO"
        description="Aktivirajte premium paket za izdvojene oglase, analitiku, AI opise, verifikovanu oznaku i vecu vidljivost u pretrazi."
        canonicalPath="/premium"
      />
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-md bg-white p-6 shadow-soft dark:bg-[#102017]">
          <div className="inline-flex items-center gap-2 rounded-md bg-accent/20 px-3 py-2 text-sm font-black"><Sparkles size={16} />{t.freeTrial}: 14 dana</div>
          <h1 className="mt-4 text-4xl font-black">{t.fullAccessOffer}</h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{t.premiumBenefits}</p>
          {status && <div className="mt-4 rounded-md bg-primary/10 p-3 text-sm font-bold text-primary">{status}</div>}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={startTrial}><BadgeCheck size={18} />{t.startTrial}</Button>
            <Button className="bg-slate-950 hover:bg-slate-800" onClick={checkout}>{t.payWithMonri}</Button>
          </div>
        </div>
        <Card className="p-5">
          <img src="/marketing-marketplace.png" alt="FARMA OGLASI PRO desktop i mobilni prikaz" className="mb-4 aspect-[4/3] w-full rounded-md object-cover" />
          <div className="text-sm font-black uppercase text-primary">{t.premiumOnlyFeature}</div>
          <div className="mt-2 text-3xl font-black">5 KM</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">mjesecno, Monri test placanje</div>
        </Card>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ Icon, title, body }) => (
          <Card key={title} className="p-5">
            <Icon className="text-primary" />
            <h2 className="mt-3 font-black">{title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
