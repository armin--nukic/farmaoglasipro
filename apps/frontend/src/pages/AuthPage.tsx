import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { BadgeCheck, KeyRound, Mail, Phone, UserRound } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";

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

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { t } = useI18n();
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("superadmin@farmaoglasi.pro");
  const [password, setPassword] = useState("Password123!");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!googleClientId || window.google) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  async function submit() {
    setError("");
    try {
      if (mode === "login") await auth.login(email, password);
      else await auth.register({ email, password, fullName, phone });
      navigate("/");
    } catch {
      setError("Auth request failed. Check credentials, API URL or Google client configuration.");
    }
  }

  async function googleSubmit() {
    setError("");
    if (!googleClientId || !window.google) {
      setError("Google SSO requires VITE_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID.");
      return;
    }
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        await auth.googleLogin(response.credential);
        navigate("/");
      }
    });
    window.google.accounts.id.prompt();
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-104px)] max-w-7xl items-center gap-6 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-6">
        <div className="mb-5 flex items-center gap-2">
          <BadgeCheck className="text-primary" />
          <h1 className="text-3xl font-black">{mode === "login" ? t.login : t.register}</h1>
        </div>
        <div className="space-y-3">
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
          <Button className="w-full" onClick={submit}>{mode === "login" ? t.login : t.register}</Button>
          <button className="h-10 w-full rounded-md border border-border bg-white text-sm font-black dark:bg-[#102017]" onClick={googleSubmit}>{t.continueWithGoogle}</button>
        </div>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          {mode === "login" ? <Link to="/register">{t.register}</Link> : <Link to="/login">{t.login}</Link>}
        </div>
      </Card>
      <section>
        <div className="text-sm font-black uppercase text-primary">FARMA OGLASI PRO</div>
        <h2 className="mt-2 text-4xl font-black">JWT login, demo admin account, Google SSO and verified marketplace roles.</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Demo seed creates `superadmin@farmaoglasi.pro` with password `Password123!`. Google SSO works after adding OAuth client IDs in environment variables and authorized domains in Google Cloud Console.</p>
      </section>
    </main>
  );
}
