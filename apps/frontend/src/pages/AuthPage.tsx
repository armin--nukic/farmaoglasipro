import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { BadgeCheck, KeyRound, Mail, Phone, UserRound } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";
import { Seo } from "../lib/seo";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const googleConfigured = Boolean(googleClientId && !googleClientId.includes("replace-with-google-oauth-client-id"));

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { t } = useI18n();
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(mode === "login" ? "testuser@farmaoglasi.pro" : "");
  const [password, setPassword] = useState("Password123!");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!googleConfigured || window.google) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError("");
    try {
      if (mode === "login") await auth.login(email, password);
      else await auth.register({ email, password, fullName, phone });
      navigate("/");
    } catch {
      setError("Prijava nije uspjela. Provjerite podatke, API URL ili Google konfiguraciju.");
    }
  }

  async function googleSubmit() {
    setError("");
    if (!googleConfigured) {
      setError("Google SSO je opcionalan lokalno. Dodajte GOOGLE_CLIENT_ID i VITE_GOOGLE_CLIENT_ID u .env, zatim ponovo pokrenite frontend/backend.");
      return;
    }
    if (!window.google) {
      setError("Google SSO skripta se jos ucitava. Pokusajte ponovo za trenutak.");
      return;
    }
    const clientId = googleClientId!;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        await auth.googleLogin(response.credential);
        navigate("/");
      }
    });
    window.google.accounts.id.prompt();
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-104px)] max-w-7xl items-center gap-6 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <Seo
        title={`${mode === "login" ? "Prijava" : "Registracija"} | FARMA OGLASI PRO`}
        description="Prijavite se ili kreirajte FARMA OGLASI PRO profil za objavu oglasa, premium paket, poruke i veterinarske termine."
        canonicalPath={mode === "login" ? "/login" : "/register"}
      />
      <Card className="p-6">
        <div className="mb-5 flex items-center gap-2">
          <BadgeCheck className="text-primary" />
          <h1 className="text-3xl font-black">{mode === "login" ? t.login : t.register}</h1>
        </div>
        <form className="space-y-3" onSubmit={submit}>
          {mode === "register" && (
            <>
              <label className="text-sm font-bold">{t.fullName}</label>
              <div className="relative"><UserRound className="absolute left-3 top-2.5 text-slate-400" size={18} /><Input className="pl-10" value={fullName} onChange={(event) => setFullName(event.target.value)} /></div>
              <label className="text-sm font-bold">{t.phone}</label>
              <div className="relative"><Phone className="absolute left-3 top-2.5 text-slate-400" size={18} /><Input className="pl-10" value={phone} onChange={(event) => setPhone(event.target.value)} /></div>
            </>
          )}
          <label className="text-sm font-bold">{t.email}</label>
          <div className="relative"><Mail className="absolute left-3 top-2.5 text-slate-400" size={18} /><Input className="pl-10" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <label className="text-sm font-bold">{t.password}</label>
          <div className="relative"><KeyRound className="absolute left-3 top-2.5 text-slate-400" size={18} /><Input className="pl-10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
          {error && <div className="rounded-md bg-danger/10 p-3 text-sm font-bold text-danger">{error}</div>}
          <Button className="w-full">{mode === "login" ? t.login : t.register}</Button>
          <button type="button" className="h-10 w-full rounded-md border border-border bg-white text-sm font-black dark:bg-[#102017] disabled:cursor-not-allowed disabled:opacity-60" onClick={googleSubmit} disabled={!googleConfigured}>
            {googleConfigured ? t.continueWithGoogle : "Google SSO nije podesen"}
          </button>
          {!googleConfigured && <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lokalna JWT prijava radi odmah. Google zahtijeva stvarne OAuth client ID vrijednosti u `.env`.</p>}
        </form>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          {mode === "login" ? <Link to="/register">{t.register}</Link> : <Link to="/login">{t.login}</Link>}
        </div>
      </Card>
      <section>
        <div className="text-sm font-black uppercase text-primary">FARMA OGLASI PRO</div>
        <h2 className="mt-2 text-4xl font-black">Prijava, demo admin nalog, Google SSO i provjerene korisnicke uloge.</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Demo seed kreira `superadmin@farmaoglasi.pro` sa lozinkom `Password123!`. Google SSO radi nakon dodavanja OAuth client ID vrijednosti i autorizovanih domena.</p>
      </section>
    </main>
  );
}
