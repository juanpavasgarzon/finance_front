"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { getToken } from "@/lib/api/client";
import { notificationService } from "@/lib/services/notification.service";
import { ensureApiUrl } from "@/lib/env";
import { NOTIFICATIONS_NAMESPACE } from "@/lib/notifications/types";
import type { AppNotification } from "@/lib/notifications/types";

const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

function getWsUrl(): string {
  const apiUrl = ensureApiUrl();
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  try {
    const u = new URL(apiUrl);
    return `${u.protocol === "https:" ? "wss:" : "ws:"}//${u.host}`;
  } catch {
    throw new Error("Invalid NEXT_PUBLIC_API_URL");
  }
}

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function parsePayload(payload: unknown): AppNotification | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const p = payload as Record<string, unknown>;
  const id = typeof p.id === "string" ? p.id : crypto.randomUUID();
  const message = typeof p.message === "string" ? p.message : "";
  const title = typeof p.title === "string" ? p.title : undefined;
  const type = ["info", "success", "warning", "error"].includes(String(p.type)) ? (p.type as AppNotification["type"]) : undefined;
  const createdAt = typeof p.createdAt === "string" ? p.createdAt : new Date().toISOString();
  return { id, title, message, type, read: false, createdAt };
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const token = getToken();

  const { data: notifications = [] } = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () => notificationService.listUnread(),
    enabled: !!token,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  useEffect(() => {
    if (!token || typeof window === "undefined") {
      return;
    }

    const url = getWsUrl();
    const socketInstance = io(`${url}${NOTIFICATIONS_NAMESPACE}`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketInstance.on("notification", (payload: unknown) => {
      const notification = parsePayload(payload);
      if (notification) {
        queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_QUERY_KEY, (old) =>
          [notification, ...(old ?? [])].slice(0, 100)
        );
      }
    });

    socketInstance.on("connect", () => {
      console.log("Connected to notifications socket");
    });

    socketInstance.on("connect_error", () => {
      console.error("Failed to connect to notifications socket");
    });

    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
    };
  }, [token, queryClient]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead: markAsReadMutation.mutate,
      markAllAsRead: () => markAllAsReadMutation.mutate(),
    }),
    [notifications, unreadCount, markAsReadMutation, markAllAsReadMutation]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    return {
      notifications: [],
      unreadCount: 0,
      markAsRead: () => {},
      markAllAsRead: () => {},
    };
  }

  return ctx;
}
