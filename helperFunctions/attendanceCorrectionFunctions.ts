import { AttendanceCorrectionResponse } from "@/types/attendanceCorrectionTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchAttendanceCorrectionList =
  async (): Promise<AttendanceCorrectionResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/attendance-corrections/all",
        data: {},
      });
      return response;
    } catch (err) {
      console.error("Error fetching attendance correction list:", err);
      return null;
    }
  };