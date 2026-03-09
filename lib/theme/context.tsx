"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";

const COOKIE_KEY = "finance_theme";

function setCookie(value: string) {
  document.cookie = `${COOKIE_KEY}=${value};path=/;max-age=${365 * 24 * 60 * 60}`;
}

function getCookie(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  const cookie = document.cookie.split(";").find((c) => c.trim().startsWith(`${COOKIE_KEY}=`));

  if (!cookie) {
    return null;
  }

  const value = cookie.split("=")[1]?.trim();

  if (value === "dark" || value === "light") {
    return value;
  }

  return null;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const fromCookie = getCookie();

  if (fromCookie) {
    return fromCookie;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setCookie(theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState((prev) => (prev === "light" ? "dark" : "light")), []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return ctx;
}
