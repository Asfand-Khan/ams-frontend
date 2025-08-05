export interface AttendanceCorrection {
  id: number;
  employee_id: number;
  attendance_date: string; // e.g., "2025-07-15" (ISO format)
  request_type: "missed_check_in" | "missed_check_out" | "wrong_time" | "both";
  original_check_in: string | null;  // e.g., "10:45:25" or null
  original_check_out: string | null;
  requested_check_in: string | null;
  requested_check_out: string | null;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewed_by: number | null;
  reviewed_on: string | null; // ISO timestamp or null
  remarks: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string; // ISO timestamp
  updated_at: string;
  employee: {
    full_name: string;
  };
  reviewer: {
    full_name: string;
  } | null;
}

export interface AttendanceCorrectionResponse {
  status: number;
  message: string;
  payload: AttendanceCorrection[];
}