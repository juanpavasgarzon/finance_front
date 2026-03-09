"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CalculateIcon from "@mui/icons-material/Calculate";
import CategoryIcon from "@mui/icons-material/Category";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import { useAuth, useProfile, useUpdatePreferences } from "@/lib/hooks";

export const SIDEBAR_WIDTH = 264;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

const navItems = [
  { href: "/dashboard", key: "nav.dashboard", icon: DashboardIcon },
  { href: "/planner", key: "nav.planner", icon: CalculateIcon },
  { href: "/summary", key: "nav.summary", icon: AssessmentIcon },
  { href: "/categories", key: "nav.categories", icon: CategoryIcon },
  { href: "/schedules", key: "nav.schedules", icon: ScheduleIcon },
  { href: "/expenses", key: "nav.expenses", icon: TrendingDownIcon },
  { href: "/incomes", key: "nav.incomes", icon: TrendingUpIcon },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const rawPath = pathname.replace(/^\/(en|es)/, "") || "/dashboard";
  const { t, locale, setLocale, localePath } = useI18n();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const { data: profile } = useProfile();
  const updatePreferences = useUpdatePreferences();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    setLogoutOpen(false);
    logout();
  };

  const drawerWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  function renderContent(mini: boolean, showToggle: boolean) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", pt: 1, pb: 2 }}>
        {showToggle && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: mini ? "center" : "flex-start",
              px: mini ? 0 : 1.5,
              py: 0.5,
              mb: 0.5,
            }}
          >
            <IconButton onClick={onToggleCollapse} sx={{ color: "text.secondary" }}>
              {mini ? <MenuIcon /> : <MenuOpenIcon />}
            </IconButton>
          </Box>
        )}

        {!mini && profile && (
          <Box sx={{ px: 1.5, mb: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 1.5,
                bgcolor: "action.hover",
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {profile.username.charAt(0).toUpperCase()}
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ fontSize: "0.7rem", flex: 1 }}
              >
                {profile.username}
              </Typography>
            </Box>
          </Box>
        )}

        {showToggle && mini && profile && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
            <Tooltip title={profile.username} placement="right" arrow>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {profile.username.charAt(0).toUpperCase()}
              </Box>
            </Tooltip>
          </Box>
        )}

        <Divider />

        <List sx={{ flex: 1, px: mini ? 0.75 : 1.5, pt: 1.5 }}>
          {navItems.map((item) => {
            const active = rawPath === item.href;
            const Icon = item.icon;

            const btn = (
              <ListItemButton
                key={item.href}
                component={Link}
                href={localePath(item.href)}
                selected={active}
                onClick={onMobileClose}
                sx={{
                  mb: 0.5,
                  py: 1,
                  justifyContent: mini ? "center" : "flex-start",
                  px: mini ? 1 : 2,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": { bgcolor: "primary.dark" },
                    "& .MuiListItemIcon-root": { color: "inherit" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: mini ? "auto" : 40, justifyContent: "center" }}>
                  <Icon fontSize="small" />
                </ListItemIcon>

                {!mini && (
                  <ListItemText
                    primary={t(item.key)}
                    primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: "0.875rem" }}
                  />
                )}
              </ListItemButton>
            );

            if (mini) {
              return (
                <Tooltip key={item.href} title={t(item.key)} placement="right" arrow>
                  {btn}
                </Tooltip>
              );
            }

            return btn;
          })}
        </List>

        <Divider sx={{ mx: mini ? 0.5 : 2, mb: 1.5 }} />

        {!mini ? (
          <Box sx={{ px: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              <ToggleButtonGroup size="small" value={theme} exclusive onChange={(_, v) => { if (v) { setTheme(v); updatePreferences.mutate({ theme: v }); } }}>
                <ToggleButton value="light" sx={{ px: 1.5 }}><LightModeIcon fontSize="small" /></ToggleButton>
                <ToggleButton value="dark" sx={{ px: 1.5 }}><DarkModeIcon fontSize="small" /></ToggleButton>
              </ToggleButtonGroup>

              <ToggleButtonGroup size="small" value={locale} exclusive onChange={(_, v) => { if (v) { updatePreferences.mutate({ locale: v }); setLocale(v); } }}>
                <ToggleButton value="es" sx={{ px: 1.5, fontSize: "0.75rem", fontWeight: 700 }}>ES</ToggleButton>
                <ToggleButton value="en" sx={{ px: 1.5, fontSize: "0.75rem", fontWeight: 700 }}>EN</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={() => { onMobileClose(); setLogoutOpen(true); }}
            >
              {t("nav.logout")}
            </Button>

            <Typography variant="caption" color="text.disabled" sx={{ textAlign: "center", lineHeight: 1.4, fontSize: "0.65rem" }}>
              {t("footer.developer")} Jose Pavas & Juan Pavas
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, px: 0.5 }}>
            <Tooltip title={theme === "light" ? t("common.dark") : t("common.light")} placement="right" arrow>
              <IconButton
                size="small"
                onClick={() => { const next = theme === "light" ? "dark" : "light"; setTheme(next); updatePreferences.mutate({ theme: next }); }}
                sx={{ color: "text.secondary" }}
              >
                {theme === "light" ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Tooltip title={locale === "es" ? "EN" : "ES"} placement="right" arrow>
              <IconButton
                size="small"
                onClick={() => { const next = locale === "es" ? "en" : "es"; updatePreferences.mutate({ locale: next }); setLocale(next); }}
                sx={{ color: "text.secondary", fontSize: "0.7rem", fontWeight: 700 }}
              >
                {locale === "es" ? "EN" : "ES"}
              </IconButton>
            </Tooltip>

            <Tooltip title={t("nav.logout")} placement="right" arrow>
              <IconButton size="small" color="error" onClick={() => { onMobileClose(); setLogoutOpen(true); }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{t("confirm.logoutTitle")}</DialogTitle>
          <DialogContent><Typography>{t("confirm.logoutMessage")}</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => setLogoutOpen(false)}>{t("confirm.cancel")}</Button>
            <Button onClick={handleLogout} variant="contained" color="error">{t("nav.logout")}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }, transition: "width 150ms ease" }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, boxSizing: "border-box" },
        }}
      >
        {renderContent(false, false)}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: "width 150ms cubic-bezier(0.4, 0, 0.6, 1)",
            overflowX: "hidden",
          },
        }}
      >
        {renderContent(collapsed, true)}
      </Drawer>
    </Box>
  );
}
