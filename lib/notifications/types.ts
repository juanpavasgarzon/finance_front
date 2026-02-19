export interface AppNotification {
  id: string;
  title?: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export const NOTIFICATIONS_NAMESPACE = "/notifications";
