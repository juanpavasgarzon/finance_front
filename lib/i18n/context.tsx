"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Locale = "en" | "es";

type Messages = Record<string, Record<string, string>>;

const messages: Record<Locale, Messages> = {
  en: {} as Messages,
  es: {} as Messages,
};

async function loadMessages(locale: Locale): Promise<Messages> {
  if (Object.keys(messages[locale]).length > 0) {
    return messages[locale];
  }

  const mod = await import(`@/messages/${locale}.json`);
  messages[locale] = mod.default;
  return mod.default;
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  ready: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const p of parts) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[p];
  }

  return typeof current === "string" ? current : undefined;
}

export function I18nProvider({ children, defaultLocale = "en" }: { children: React.ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [data, setData] = useState<Messages>(messages[locale] ?? {});
  const [ready, setReady] = useState(false);

  React.useEffect(() => {
    let cancelled = false;
    loadMessages(locale).then((m) => {
      if (!cancelled) {
        setData(m);
        setReady(true);
      }
    });
    return () => { cancelled = true; };
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (key: string) => getNested(data as unknown as Record<string, unknown>, key) ?? key,
    [data]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, ready }),
    [locale, setLocale, t, ready]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return ctx;
}
