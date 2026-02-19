"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { I18nProvider } from "@/lib/i18n/context";
import { ThemeProvider } from "@/lib/theme/context";
import { NotificationsProvider } from "@/lib/notifications/context";
import { LoadingBackdrop } from "@/components/ui/LoadingBackdrop";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <NotificationsProvider>
            {children}
            <LoadingBackdrop />
            <Toaster position="top-right" richColors closeButton />
          </NotificationsProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
