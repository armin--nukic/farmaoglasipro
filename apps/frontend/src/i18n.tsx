import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { translations, type Locale } from "@farma/shared";

type Translation = { [K in keyof typeof translations.bs]: string };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translation;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("bs");
  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t: translations[locale] }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
