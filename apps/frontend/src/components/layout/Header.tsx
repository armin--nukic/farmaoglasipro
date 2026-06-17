import { Link, NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronDown, Globe2, Heart, LogIn, LogOut, Menu, Moon, Plus, ShieldCheck, Sun, UserCircle2 } from "lucide-react";
import type { ApiResponse } from "@farma/shared";
import { useI18n } from "../../i18n";
import { useTheme } from "../../theme";
import { useAuth } from "../../auth";
import { authApi } from "../../lib/api";

const nav = [
  ["/listings", "browseAnimals"],
  ["/farms", "farms"],
  ["/equipment", "equipment"],
  ["/veterinarians", "veterinarians"],
  ["/stations", "veterinaryStations"],
  ["/auctions", "auctions"],
  ["/forum", "forum"],
  ["/premium", "premium"],
  ["/map", "maps"],
  ["/admin", "admin"]
] as const;

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export function Header() {
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, token, logout } = useAuth();
  const notifications = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => (await authApi<ApiResponse<NotificationItem[]>>("/notifications", token!)).data,
    enabled: Boolean(user && token),
    refetchInterval: 15000,
    retry: 1
  });
  const unread = notifications.data?.filter((item) => !item.read).length ?? 0;
  const canSeeAdmin = user ? ["ADMINISTRATOR", "SUPER_ADMIN", "MODERATOR"].includes(user.role) : false;
  const visibleNav = nav.filter(([to]) => to !== "/admin" || canSeeAdmin);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur dark:bg-[#0b1710]/95">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center gap-3 px-4 xl:gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-3 rounded-2xl bg-white/90 px-2 py-2 font-black tracking-wide dark:bg-white/5 lg:min-w-[172px] xl:min-w-[182px]">
          <img src="/logo.svg" alt="FARMA OGLASI PRO" className="h-12 w-12 shrink-0 rounded-xl logo-pulse" />
          <span className="hidden min-w-0 leading-none sm:block">
            <span className="block text-[12px] font-black tracking-[0.12em] text-primary">FARMA</span>
            <span className="mt-1 block text-[15px] font-black tracking-tight text-slate-950 dark:text-white">OGLASI PRO</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center gap-0.5 xl:flex xl:justify-center">
          {visibleNav.map(([to, key]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `rounded-md px-2.5 py-2 text-[13px] font-black transition xl:px-3 ${isActive ? "bg-primary/10 text-primary shadow-sm" : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"}`}>
              {t[key]}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 xl:gap-2">
          <button className="hidden h-10 w-10 place-items-center rounded-md border border-border sm:grid" aria-label="Favorites"><Heart size={18} /></button>
          <div className="group relative">
            <button className="relative grid h-10 w-10 place-items-center rounded-md border border-border" aria-label={t.myNotifications}>
              <Bell size={18} />
              {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[10px] font-black text-white">{unread}</span>}
            </button>
            <div className="invisible absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-md border border-border bg-white p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 dark:bg-[#102017]">
              <div className="mb-2 font-black">{t.myNotifications}</div>
              {!user && <p className="text-sm text-slate-600 dark:text-slate-300">{t.login}</p>}
              {user && !notifications.data?.length && <p className="text-sm text-slate-600 dark:text-slate-300">Nema novih notifikacija.</p>}
              <div className="space-y-2">
                {notifications.data?.slice(0, 5).map((item) => (
                  <div key={item.id} className={`rounded-md border border-border p-2 text-sm ${item.read ? "opacity-70" : "bg-primary/5"}`}>
                    <div className="font-black">{item.title}</div>
                    <div className="text-slate-600 dark:text-slate-300">{item.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="inline-flex h-10 items-center gap-1 rounded-md border border-border px-2 text-xs font-black" onClick={() => setLocale(locale === "bs" ? "en" : "bs")} aria-label="Language"><Globe2 size={17} />{locale === "bs" ? "BS" : "EN"}</button>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border" onClick={toggleTheme} aria-label={theme === "dark" ? t.lightMode : t.darkMode}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          {user ? (
            <div className="group relative hidden sm:block">
              <button className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-left text-sm font-bold">
                <UserCircle2 size={18} />
                <span className="max-w-32 truncate">{user.fullName}</span>
                <ChevronDown size={15} />
              </button>
              <div className="invisible absolute right-0 mt-2 w-64 rounded-md border border-border bg-white p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 dark:bg-[#102017]">
                <div className="font-black">{user.fullName}</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{user.email}</div>
                <div className="mt-2 rounded-md bg-primary/10 px-2 py-1 text-xs font-black text-primary">{t.role}: {user.role}</div>
                <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-black" onClick={logout}><LogOut size={17} />{t.logout}</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-bold lg:inline-flex"><LogIn size={17} />{t.login}</Link>
          )}
          <Link to="/create-listing" className="hidden h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-black text-primary-foreground shadow-[0_12px_24px_rgba(46,125,50,0.24)] transition hover:-translate-y-0.5 hover:bg-[#256b2a] lg:inline-flex xl:px-5"><Plus size={18} />{t.createListing}</Link>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border xl:hidden" aria-label="Menu"><Menu size={18} /></button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 xl:hidden">
        {visibleNav.map(([to, key]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `whitespace-nowrap rounded-md px-3 py-2 text-xs font-black ${isActive ? "bg-primary text-white" : "bg-primary/5 text-primary"}`}>
            {t[key]}
          </NavLink>
        ))}
        <Link to="/create-listing" className="whitespace-nowrap rounded-md bg-accent px-3 py-2 text-xs font-black text-slate-950">{t.createListing}</Link>
      </nav>

      <div className="border-t border-primary/10 bg-gradient-to-r from-primary/10 via-white to-accent/20 px-4 py-2 text-xs font-black text-primary dark:from-primary/20 dark:via-[#0b1710] dark:to-accent/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2"><ShieldCheck size={14} /> {user ? `${t.loggedInAs}: ${user.fullName} | ${user.role}` : "Verified breeder, vet and premium listing workflow ready"} <span className="rounded-md bg-white/80 px-2 py-1 text-[11px] text-slate-700 dark:bg-white/10 dark:text-slate-200">Full Access 5 KM / mjesec</span></div>
      </div>
    </header>
  );
}
