"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/hooks";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const navItems = [
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/categories", key: "nav.categories" },
  { href: "/schedules", key: "nav.schedules" },
  { href: "/expenses", key: "nav.expenses" },
  { href: "/incomes", key: "nav.incomes" },
] as const;

export function AppNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setLogoutConfirmOpen(false);
    logout();
  };

  return (
    <>
      <nav className="sticky top-0 z-30 border-border border-b bg-card">
        <div className="container mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 px-3 py-2.5 sm:px-5 sm:py-3 lg:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-0">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="shrink-0 rounded p-2 text-foreground hover:bg-primary-muted md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <Link
            href="/dashboard"
            className="shrink-0 text-lg font-semibold text-primary"
          >
            {t("common.appName")}
          </Link>
          <div className="hidden md:ml-4 md:flex md:items-center md:gap-1 md:border-border md:border-l md:pl-4">
            {navItems.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-primary-muted text-primary"
                    : "text-foreground hover:bg-primary-muted/50"
                }`}
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <NotificationBell />
          <button
            type="button"
            onClick={() => setLogoutConfirmOpen(true)}
            className="hidden rounded px-3 py-2 text-sm font-medium text-muted hover:bg-primary-muted/50 hover:text-foreground md:block"
          >
            {t("nav.logout")}
          </button>
        </div>

        <div
          className={`absolute left-0 right-0 top-full border-border border-b bg-card shadow-lg md:hidden ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col px-3 py-3 sm:px-5">
            <div className="flex flex-col gap-0.5">
              {navItems.map(({ href, key }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-primary-muted text-primary"
                      : "text-foreground hover:bg-primary-muted/50"
                  }`}
                >
                  {t(key)}
                </Link>
              ))}
            </div>
            <div className="mt-3 border-border border-t pt-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setLogoutConfirmOpen(true);
                }}
                className="w-full rounded-lg bg-background/80 px-3 py-3 text-left text-sm font-medium text-muted hover:bg-primary-muted/50 hover:text-foreground"
              >
                {t("nav.logout")}
              </button>
            </div>
          </div>
        </div>
        </div>
      </nav>

      <ConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogoutConfirm}
        title={t("confirm.logoutTitle")}
        message={t("confirm.logoutMessage")}
        variant="danger"
        confirmLabel={t("nav.logout")}
      />
    </>
  );
}
