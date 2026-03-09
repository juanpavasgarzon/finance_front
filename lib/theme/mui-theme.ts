"use client";

import { createTheme } from "@mui/material/styles";

import type { Theme as AppTheme } from "@/lib/theme/context";

const lightPalette = {
  background: "#F1F5F9",
  paper: "#FFFFFF",
  foreground: "#1E293B",
  primary: "#4F46E5",
  primaryDark: "#4338CA",
  secondary: "#F59E0B",
  secondaryDark: "#D97706",
  border: "#E2E8F0",
  muted: "#64748B",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F97316",
  info: "#06B6D4",
};

const darkPalette = {
  background: "#0B1121",
  paper: "#152035",
  foreground: "#E2E8F0",
  primary: "#818CF8",
  primaryDark: "#6366F1",
  secondary: "#FBBF24",
  secondaryDark: "#F59E0B",
  border: "#1E3055",
  muted: "#94A3B8",
  success: "#34D399",
  danger: "#F87171",
  warning: "#FB923C",
  info: "#22D3EE",
};

export function buildMuiTheme(mode: AppTheme) {
  const p = mode === "dark" ? darkPalette : lightPalette;

  return createTheme({
    palette: {
      mode,
      primary: { main: p.primary, dark: p.primaryDark },
      secondary: { main: p.secondary, dark: p.secondaryDark },
      error: { main: p.danger },
      success: { main: p.success },
      warning: { main: p.warning },
      info: { main: p.info },
      background: { default: p.background, paper: p.paper },
      text: { primary: p.foreground, secondary: p.muted },
      divider: p.border,
    },
    typography: {
      fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      fontWeightBold: 700,
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { backgroundColor: "var(--background)", colorScheme: mode },
          body: { backgroundColor: "var(--background)", color: "var(--foreground)" },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: "var(--card)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: "var(--card)",
            border: `1px solid var(--border)`,
            boxShadow: mode === "light"
              ? "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)"
              : "none",
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: { backgroundColor: "transparent" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600, borderRadius: 10 },
        },
      },
      MuiTextField: {
        defaultProps: { size: "small" },
      },
      MuiInputBase: {
        styleOverrides: {
          root: { backgroundColor: "transparent" },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: { backgroundColor: "transparent", "&:hover": { backgroundColor: "transparent" }, "&.Mui-focused": { backgroundColor: "transparent" } },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: { backgroundColor: "transparent" },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            minHeight: 44,
            backgroundColor: "transparent",
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: { backgroundColor: "var(--card)" },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: "var(--border)", backgroundColor: "inherit" },
          head: { fontWeight: 600, backgroundColor: "var(--card)" },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:last-child td, &:last-child th": { border: 0 },
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--card)",
            backgroundImage: "none",
            borderBottom: `1px solid var(--border)`,
            boxShadow: "none",
            color: "var(--foreground)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            borderColor: "var(--border)",
            backgroundColor: "var(--card)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { backgroundImage: "none", borderRadius: 16, border: `1px solid var(--border)`, backgroundColor: "var(--card)" },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: { backgroundColor: "var(--card)" },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: { backgroundColor: "var(--card)" },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: { backgroundColor: "var(--card)" },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: { borderRadius: 8, textTransform: "none" },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: { backgroundColor: "transparent" },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { backgroundColor: "transparent" },
          notchedOutline: { borderColor: "var(--border)" },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: { backgroundColor: "transparent" },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: { backgroundImage: "none", backgroundColor: "var(--card)" },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: { backgroundImage: "none", backgroundColor: "var(--card)" },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: { backgroundImage: "none", backgroundColor: "var(--card)" },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === "dark" ? "#1E3055" : "#1E293B",
            color: "#E2E8F0",
          },
        },
      },
    },
  });
}
