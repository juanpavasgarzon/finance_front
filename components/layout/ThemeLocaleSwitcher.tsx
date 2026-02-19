"use client";

import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import type { Locale } from "@/lib/i18n/context";

const localeOptions: { value: Locale; labelKey: string }[] = [
  { value: "en", labelKey: "common.english" },
  { value: "es", labelKey: "common.spanish" },
];

const themeOptions = [
  { value: "light" as const, labelKey: "common.light" },
  { value: "dark" as const, labelKey: "common.dark" },
];

export function ThemeLocaleSwitcher() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="footer-language" className="text-xs font-medium text-muted">
          {t("common.language")}
        </label>
        <select
          id="footer-language"
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="min-w-[140px] rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {localeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="footer-theme" className="text-xs font-medium text-muted">
          {t("common.theme")}
        </label>
        <select
          id="footer-theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value as "light" | "dark")}
          className="min-w-[140px] rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {themeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
