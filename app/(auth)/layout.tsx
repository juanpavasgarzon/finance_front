"use client";

import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ position: "fixed", top: 16, right: 16, display: "flex", gap: 1 }}>
        <ToggleButtonGroup
          size="small"
          value={theme}
          exclusive
          onChange={(_, v) => { if (v) { setTheme(v); } }}
        >
          <ToggleButton value="light"><LightModeIcon fontSize="small" /></ToggleButton>
          <ToggleButton value="dark"><DarkModeIcon fontSize="small" /></ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          size="small"
          value={locale}
          exclusive
          onChange={(_, v) => { if (v) { setLocale(v); } }}
        >
          <ToggleButton value="es" sx={{ fontWeight: 700, fontSize: "0.75rem" }}>ES</ToggleButton>
          <ToggleButton value="en" sx={{ fontWeight: 700, fontSize: "0.75rem" }}>EN</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
        <ShowChartIcon color="primary" sx={{ fontSize: 44 }} />

        <Typography variant="h4" fontWeight={800} color="primary" letterSpacing={-0.5}>
          {t("common.appName")}
        </Typography>
      </Box>

      <Box sx={{ width: "100%", maxWidth: 440 }}>
        {children}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
        &copy; {new Date().getFullYear()} · {t("footer.developer")} Jose Pavas &amp; Juan Pavas
      </Typography>
    </Box>
  );
}
