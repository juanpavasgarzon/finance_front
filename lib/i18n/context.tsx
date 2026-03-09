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
  localePath: (path: string) => string;
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

function getInitialLocale(fallback: Locale): Locale {
  if (typeof window === "undefined") {
    return fallback;
  }

  const match = window.location.pathname.match(/^\/(en|es)(\/|$)/);

  if (match) {
    return match[1] as Locale;
  }

  const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("locale="));

  if (cookie) {
    const value = cookie.split("=")[1].trim();

    if (value === "en" || value === "es") {
      return value;
    }
  }

  return fallback;
}

export function I18nProvider({ children, defaultLocale = "es" }: { children: React.ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale(defaultLocale));
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

  const setLocale = useCallback((l: Locale) => {
    if (typeof window !== "undefined") {
      document.cookie = `locale=${l};path=/;max-age=${365 * 24 * 60 * 60}`;
      const currentPath = window.location.pathname.replace(/^\/(en|es)/, "");
      window.location.href = `/${l}${currentPath || "/dashboard"}`;
    }

    setLocaleState(l);
  }, []);

  const localePath = useCallback(
    (path: string) => `/${locale}${path}`,
    [locale]
  );

  const t = useCallback(
    (key: string) => getNested(data as unknown as Record<string, unknown>, key) ?? key,
    [data]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, ready, localePath }),
    [locale, setLocale, t, ready, localePath]
  );

  if (!ready) {
    return (
      <I18nContext.Provider value={value}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #E2E8F0", borderTopColor: "#4F46E5", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </I18nContext.Provider>
    );
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return ctx;
}
