"use client";

import { useIsFetching } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n/context";

export function LoadingBackdrop() {
  const { ready: i18nReady } = useI18n();
  const isFetching = useIsFetching();
  const show = !i18nReady || isFetching > 0;

  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
    </div>
  );
}
