import { LeaveResponse } from "@/types/leaveTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchLeaveList =
  async (): Promise<LeaveResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/leaves/all",
        data: {},
      });
      return response;
    } catch (err) {
      console.error("Error fetching leave list:", err);
      return null;
    }
  };