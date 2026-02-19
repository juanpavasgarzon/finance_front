"use client";

import { useI18n } from "@/lib/i18n/context";
import { ThemeLocaleSwitcher } from "@/components/layout/ThemeLocaleSwitcher";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-border border-t bg-card">
      <div className="container mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-primary">{t("common.appName")}</p>
            <p className="max-w-md text-sm text-muted">{t("footer.appDescription")}</p>
            <p className="text-sm text-muted">
              {t("footer.developer")} <span className="font-medium text-foreground">Juan Pavas</span>
            </p>
            <p className="text-xs text-muted">© {year} Pavas. {t("footer.copyright")}</p>
          </div>
          <div className="shrink-0">
            <ThemeLocaleSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
