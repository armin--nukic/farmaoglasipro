import { Link, NavLink } from "react-router";
import { Bell, Globe2, Heart, LogIn, LogOut, Menu, Moon, Plus, ShieldCheck, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useI18n } from "../../i18n";
import { useTheme } from "../../theme";
import { useAuth } from "../../auth";

const nav = [
  ["/listings", "browseAnimals"],
  ["/farms", "farms"],
  ["/equipment", "equipment"],
  ["/veterinarians", "veterinarians"],
  ["/stations", "veterinaryStations"],
  ["/auctions", "auctions"],
  ["/admin", "admin"]
] as const;

export function Header() {
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur dark:bg-[#0b1710]/90">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-black tracking-wide">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-white">FP</span>
          <span className="hidden sm:inline">{t.appName}</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {nav.map(([to, key]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"}`}>
              {t[key]}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border" aria-label="Favorites"><Heart size={18} /></button>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border" aria-label="Notifications"><Bell size={18} /></button>
          <button className="inline-flex h-10 items-center gap-1 rounded-md border border-border px-2 text-xs font-black" onClick={() => setLocale(locale === "bs" ? "en" : "bs")} aria-label="Language"><Globe2 size={17} />{locale === "bs" ? "BS" : "EN"}</button>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border" onClick={toggleTheme} aria-label={theme === "dark" ? t.lightMode : t.darkMode}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          {user ? (
            <button className="hidden h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-bold sm:inline-flex" onClick={logout}><LogOut size={17} />{t.logout}</button>
          ) : (
            <Link to="/login" className="hidden h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-bold sm:inline-flex"><LogIn size={17} />{t.login}</Link>
          )}
          <Button className="hidden sm:inline-flex"><Plus size={18} />{t.createListing}</Button>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border lg:hidden" aria-label="Menu"><Menu size={18} /></button>
        </div>
      </div>
      <div className="border-t border-border bg-primary/5 px-4 py-2 text-xs font-medium text-primary">
        <div className="mx-auto flex max-w-7xl items-center gap-2"><ShieldCheck size={14} /> {user ? `${user.fullName} · ${user.role}` : "Verified breeder, vet and premium listing workflow ready"}</div>
      </div>
    </header>
  );
}
