"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo, useState } from "react";
import { Toaster } from "sonner";

import { I18nProvider } from "@/lib/i18n/context";
import { ThemeProvider, useTheme } from "@/lib/theme/context";
import { NotificationsProvider } from "@/lib/notifications/context";
import { buildMuiTheme } from "@/lib/theme/mui-theme";
import { ThemeRegistry } from "@/lib/theme/ThemeRegistry";
import { LoadingBackdrop } from "@/components/ui/LoadingBackdrop";

function MuiWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const muiTheme = useMemo(() => buildMuiTheme(theme), [theme]);

  return (
    <ThemeRegistry>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
        <Toaster position="top-right" richColors closeButton theme={theme} />
      </MuiThemeProvider>
    </ThemeRegistry>
  );
}

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
        <MuiWrapper>
          <I18nProvider>
            <NotificationsProvider>
              {children}
              <LoadingBackdrop />
            </NotificationsProvider>
          </I18nProvider>
        </MuiWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
