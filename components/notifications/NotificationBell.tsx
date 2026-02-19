"use client";

import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useNotifications } from "@/lib/notifications/context";
import type { AppNotification } from "@/lib/notifications/types";

const DURATION_MS = 280;
const MOBILE_BREAKPOINT = 768;

function formatNotificationTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) {
    return "Now";
  }

  if (diffMins < 60) {
    return `${diffMins}m`;
  }

  const diffHours = Math.floor(diffMins / 60);

  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays}d`;
}

function NotificationContent({
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  t,
}: {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  t: (key: string) => string;
}) {
  return (
    <>
      <div className="max-h-[min(60vh,400px)] overflow-y-auto md:max-h-[min(60vh,400px)]">
        {notifications.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted">{t("notifications.noNotifications")}</p>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((n) => (
              <li
                key={n.id}
                role="button"
                tabIndex={0}
                onClick={() => markAsRead(n.id)}
                onKeyDown={(e) => e.key === "Enter" && markAsRead(n.id)}
                className={`cursor-pointer px-4 py-3 transition-colors hover:bg-primary-muted/30 ${n.read ? "opacity-70" : ""}`}
              >
                <div className="flex justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {n.title && <p className="truncate text-sm font-medium text-foreground">{n.title}</p>}
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">{n.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{formatNotificationTime(n.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export function NotificationBell() {
  const { t } = useI18n();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const handleClose = () => {
    if (isMobile) {
      setIsExiting(true);
      setOpen(false);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isMobile]);

  useEffect(() => {
    if (open) {
      setIsExiting(false);
      setIsEntering(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsEntering(false));
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  const isVisible = open || isExiting;

  useEffect(() => {
    if (!open && isVisible) {
      setIsExiting(true);
    }
  }, [open, isVisible]);

  const isOpen = open && !isExiting && !isEntering;

  useEffect(() => {
    if (!isVisible || !isMobile) {
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible, isMobile]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded p-2 text-muted hover:bg-primary-muted hover:text-foreground"
        aria-label={t("notifications.title")}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && !isMobile && (
        <div className="absolute right-0 top-full z-50 mt-1 w-[320px] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card shadow-xl sm:w-[360px]">
          <div className="flex items-center justify-between border-border border-b px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">{t("notifications.title")}</h3>
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-primary hover:underline"
              >
                {t("notifications.markAllRead")}
              </button>
            )}
          </div>
          <NotificationContent
            notifications={notifications}
            unreadCount={unreadCount}
            markAsRead={markAsRead}
            markAllAsRead={markAllAsRead}
            t={t}
          />
        </div>
      )}

      {isMobile && isVisible && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t("notifications.title")}
        >
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-[${DURATION_MS}ms] ease-out ${isOpen ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDuration: `${DURATION_MS}ms` }}
            onClick={handleClose}
            aria-hidden="true"
          />
          <aside
            className={`absolute bottom-0 left-0 right-0 flex max-h-[85vh] flex-col rounded-t-2xl border-border border-t bg-card shadow-xl transition-transform duration-[${DURATION_MS}ms] ease-out ${
              isOpen ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ transitionDuration: `${DURATION_MS}ms` }}
            onClick={(e) => e.stopPropagation()}
            onTransitionEnd={() => {
              if (isExiting) {
                setIsExiting(false);
              }
            }}
          >
            <div className="flex shrink-0 items-center justify-between border-border border-b px-4 py-3">
              <h2 className="text-lg font-semibold text-foreground">{t("notifications.title")}</h2>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t("notifications.markAllRead")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg p-2 text-muted hover:bg-primary-muted hover:text-foreground"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <NotificationContent
              notifications={notifications}
              unreadCount={unreadCount}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
              t={t}
            />
          </aside>
        </div>
      )}
    </div>
  );
}
