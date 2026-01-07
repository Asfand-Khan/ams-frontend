// Attendance Listing
export interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_code: string;
  full_name: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_status: string | null;
  check_out_status: string | null;
  day_status: string | null;
   profile_picture?: string | null;
  work_hours: string | null;
  check_in_office: string | null;
  check_out_office: string | null;
}

export interface AttendanceResponse {
  status: number;
  message: string;
  payload: AttendanceRecord[];
}

// Attendance Single
export interface SingleAttendanceResponse {
  status: number;
  message: string;
  payload: SingleAttendanceRecord[];
}

export interface SingleAttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  check_in_time: string | null;
  check_in_office_id: number | null;
  check_out_time: string | null;
  check_out_device_id: number | null;
  check_out_office_id: number | null;
  work_hours: string | null;
  check_in_status: string | null;
  check_out_status: string | null;
  day_status: "weekend" | "present" | "absent" | "holiday" | string;
  verified_by: number | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export type DailyAttendanceSummaryPayload = {
  total_employees: number;
  present: string;
  on_leave: string;
  weekend: string;
  work_from_home: string;
  absent: string;
  late_arrivals: string;
  manual_check_in: string;
  early_leaves: string;
  half_days: string;
  overtimes: string;
  manual_check_out: string;
};

export type DailyAttendanceSummaryResponse = {
  status: number;
  message: string;
  payload: DailyAttendanceSummaryPayload[];
};

export type AttendanceSummaryResponse = {
  status: number;
  message: string;
  payload: AttendanceSummaryPayload[];
};

export type AttendanceSummaryPayload = {
  employee_id: number;
  employee_name: string;
  department_name: string;
  designation_title: string;
  total_days: string;
  working_days: string;
  present_days: string;
  absent_days: string;
  leave_days: string;
  weekend_days: string;
  weekend_attendance_days: string;
  holiday_days: string;
  work_from_home_days: string;
  on_time_check_ins: string;
  late_check_ins: string;
  manual_check_ins: string;
  on_time_check_outs: string;
  early_leave_check_outs: string;
  early_go_check_outs: string;
  overtime_check_outs: string;
  half_day_check_outs: string;
  manual_check_outs: string;
  actual_work_seconds: string; // You may convert this to `number` if needed
  expected_work_hours: string; // This seems like total hours (e.g., "184")
  actual_work_hours: string;   // This is in "HH:MM:SS" format
};
