export interface NotificationPayload {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: "holiday" | string;
  priority: "low" | "medium" | "high" | string;
  status: "read" | "unread" | string;
  broadcast: boolean;
  sent_at: string; // ISO Date string
  is_active: boolean;
  is_deleted: boolean;
  created_at: string; // ISO Date string
  user: {
    id: number;
    username: string;
  } | null;
}

export interface NotificationResponse {
  status: number;
  message: string;
  payload: NotificationPayload[];
}
