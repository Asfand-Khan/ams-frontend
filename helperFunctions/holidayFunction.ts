import { HolidayResponse } from "@/types/holidayTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchHolidayList =
  async (): Promise<HolidayResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/holidays",
      });
      return response;
    } catch (err) {
      console.error("Error fetching holiday list:", err);
      return null;
    }
  };