import { MeetingResponse } from "@/types/scheduleTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchMeetingList =
  async (): Promise<MeetingResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/meetings",
      });
      return response;
    } catch (err) {
      console.error("Error fetching meeting list:", err);
      return null;
    }
  };
