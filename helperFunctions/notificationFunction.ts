import { NotificationResponse } from "@/types/notificationTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchNotificationList =
  async (): Promise<NotificationResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/notifications/all",
        data: {},
      });
      return response;
    } catch (err) {
      console.error("Error fetching notification list:", err);
      return null;
    }
  };
