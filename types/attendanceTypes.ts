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