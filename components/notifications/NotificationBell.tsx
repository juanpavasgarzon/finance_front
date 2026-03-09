"use client";

import { useState } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useI18n } from "@/lib/i18n/context";
import { useNotifications } from "@/lib/notifications/context";
import type { AppNotification } from "@/lib/notifications/types";

function formatNotificationTime(iso: string, t: (key: string) => string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return t("notifications.now");
  }

  if (diffMins < 60) {
    return `${diffMins}${t("notifications.minutesShort")}`;
  }

  const diffHours = Math.floor(diffMins / 60);

  if (diffHours < 24) {
    return `${diffHours}${t("notifications.hoursShort")}`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays}${t("notifications.daysShort")}`;
}

function NotificationList({
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
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600}>{t("notifications.title")}</Typography>

        {notifications.length > 0 && unreadCount > 0 && (
          <Button size="small" onClick={markAllAsRead} sx={{ fontSize: "0.75rem" }}>
            {t("notifications.markAllRead")}
          </Button>
        )}
      </Box>

      <Divider />

      {notifications.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 4, textAlign: "center" }}>
          {t("notifications.noNotifications")}
        </Typography>
      ) : (
        <List disablePadding sx={{ maxHeight: 400, overflowY: "auto" }}>
          {notifications.map((n) => (
            <ListItemButton
              key={n.id}
              onClick={() => markAsRead(n.id)}
              sx={{ opacity: n.read ? 0.6 : 1, alignItems: "flex-start", gap: 1 }}
            >
              <ListItemText
                primary={n.title}
                secondary={n.message}
                primaryTypographyProps={{ variant: "body2", fontWeight: 600, noWrap: true }}
                secondaryTypographyProps={{ variant: "caption", sx: { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, pt: 0.5 }}>
                {formatNotificationTime(n.createdAt, t)}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
}

export function NotificationBell() {
  const { t } = useI18n();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      setMobileOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClick} aria-label={t("notifications.title")}>
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, mt: 1 } } }}
      >
        <NotificationList
          notifications={notifications}
          unreadCount={unreadCount}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          t={t}
        />
      </Popover>

      <SwipeableDrawer
        anchor="bottom"
        open={mobileOpen}
        onClose={handleClose}
        onOpen={() => setMobileOpen(true)}
        disableSwipeToOpen
        slotProps={{ paper: { sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "85vh" } } }}
      >
        <Box sx={{ width: 40, height: 4, bgcolor: "divider", borderRadius: 2, mx: "auto", mt: 1.5, mb: 0.5 }} />

        <NotificationList
          notifications={notifications}
          unreadCount={unreadCount}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          t={t}
        />
      </SwipeableDrawer>
    </>
  );
}
