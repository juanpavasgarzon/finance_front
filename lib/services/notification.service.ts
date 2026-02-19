import { apiFetch } from "@/lib/api/client";
import type { NotificationResponse } from "@/lib/contracts";
import type { AppNotification } from "@/lib/notifications/types";


export const notificationService = {
  async listUnread(): Promise<AppNotification[]> {
    const list = await apiFetch<NotificationResponse[]>("/notifications");
    return list?.map(toAppNotification) ?? [];
  },

  markAsRead(notificationId: string): Promise<void> {
    return apiFetch<void>(`/notifications/${notificationId}/read`, { method: "PATCH" });
  },

  markAllAsRead(): Promise<void> {
    return apiFetch<void>("/notifications/read-all", { method: "PATCH" });
  },
};


function toAppNotification(dto: NotificationResponse): AppNotification {
  return {
    id: dto.id,
    title: dto.title,
    message: dto.message,
    type: dto.type,
    read: dto.read ?? false,
    createdAt: dto.createdAt,
  };
}
