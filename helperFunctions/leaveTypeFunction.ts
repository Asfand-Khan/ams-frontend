import { LeaveTypeResponse } from "@/types/leaveTypeTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchLeaveTypeList =
  async (): Promise<LeaveTypeResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/leave-types",
      });
      return response;
    } catch (err) {
      console.error("Error fetching leave type list:", err);
      return null;
    }
  };

export const singleLeaveType = async (dataToSend: {
  id: number;
}): Promise<LeaveTypeResponse | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/leave-types/single",
      data: dataToSend,
    });
    return response;
  } catch (err) {
    console.error("Error fetching single leave type:", err);
    return null;
  }
};
