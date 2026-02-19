/** Backend NotificationResponse – API response shape for GET /notifications */
export interface NotificationResponse {
  id: string;
  title?: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  read?: boolean;
  createdAt: string;
}
