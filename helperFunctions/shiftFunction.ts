import { ShiftsResponse } from "@/types/shiftTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchShiftList = async (): Promise<ShiftsResponse | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/shifts",
    });
    return response;
  } catch (err) {
    console.error("Error fetching shift list:", err);
    return null;
  }
};
