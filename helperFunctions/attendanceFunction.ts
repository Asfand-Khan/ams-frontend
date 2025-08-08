import {
  AttendanceResponse,
  DailyAttendanceSummaryResponse,
  SingleAttendanceResponse,
} from "@/types/attendanceTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchAttendanceListByDate = async (data: {
  attendance_date: string;
}): Promise<AttendanceResponse | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/attendances/by-date",
      data,
    });
    return response;
  } catch (err) {
    console.error("Error fetching attendance list:", err);
    return null;
  }
};

export const fetchAttendanceById = async (data: {
  attendance_id: number;
}): Promise<SingleAttendanceResponse | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/attendances/by-id",
      data,
    });
    return response;
  } catch (err) {
    console.error("Error fetching single attendance:", err);
    return null;
  }
};

export const fetchDailyAttendanceSummary =
  async (): Promise<DailyAttendanceSummaryResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/attendances/daily-attendance-summary",
      });
      return response;
    } catch (err) {
      console.error("Error fetching daily attendance summary:", err);
      return null;
    }
  };

export const fetchAttendanceHistory = async (data: {
  employee_id: number;
  start_date: string;
  end_date: string;
}): Promise<AttendanceResponse | null> => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/attendances",
      data,
    });
    return response;
  } catch (err) {
    console.error("Error fetching attendance history:", err);
    return null;
  }
};