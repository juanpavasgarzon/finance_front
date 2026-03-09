"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import ShowChartIcon from "@mui/icons-material/ShowChart";

import { useI18n } from "@/lib/i18n/context";
import { useProfile, useUpdatePreferences } from "@/lib/hooks/use-auth";
import { useTheme } from "@/lib/theme/context";
import { Sidebar, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from "@/components/layout/Sidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { SearchBar } from "@/components/layout/SearchBar";
import { getCountryLocale } from "@/lib/constants/countries";

const emptySubscribe = () => () => {};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { data: profile, isError: profileError } = useProfile();
  const updatePreferences = useUpdatePreferences();
  const { setTheme } = useTheme();

  const [collapsedOverride, setCollapsedOverride] = useState<boolean | null>(null);
  const collapsed = collapsedOverride ?? profile?.preferences.sidebarCollapsed ?? false;

  const applyTheme = useCallback((themeName: "light" | "dark") => {
    setTheme(themeName);
  }, [setTheme]);

  useEffect(() => {
    if (!profile?.preferences.theme) {
      return;
    }

    applyTheme(profile.preferences.theme);
  }, [profile?.preferences.theme, applyTheme]);

  const handleToggleCollapse = () => {
    const next = !collapsed;
    setCollapsedOverride(next);
    updatePreferences.mutate({ sidebarCollapsed: next });
  };

  const { t, localePath, locale } = useI18n();

  const dateLocale = getCountryLocale(profile?.country ?? "", locale);
  const formattedDate = new Intl.DateTimeFormat(dateLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  useEffect(() => {
    if (profileError) {
      router.replace(localePath("/login"));
    }
  }, [profileError, router, localePath]);

  const currentWidth = isClient && collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={isClient ? collapsed : false}
        onToggleCollapse={handleToggleCollapse}
      />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{ display: { md: "none" } }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ color: "text.primary" }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={700} color="primary" sx={{ flex: 1 }}>
            {t("common.appName")}
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ mr: 1, display: { xs: "none", sm: "block" } }}>
            {capitalizedDate}
          </Typography>

          <NotificationBell />
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${currentWidth}px)` },
          transition: "width 150ms ease",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar sx={{ display: { md: "none" } }} />

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            px: 3,
            py: 1,
            borderBottom: 1,
            borderColor: "var(--border)",
            bgcolor: "var(--card)",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mr: "auto" }}>
            <ShowChartIcon color="primary" sx={{ fontSize: 26 }} />

            <Typography variant="subtitle1" fontWeight={800} color="primary" letterSpacing={-0.5} noWrap>
              {t("common.appName")}
            </Typography>
          </Box>

          <SearchBar />

          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>
            {capitalizedDate}
          </Typography>

          <NotificationBell />
        </Box>

        <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2.5, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
