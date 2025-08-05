export type LeavePayload = {
  leave_id: number;
  employee_id: number;
  full_name: string;
  leave_type_id: number;
  leave_type_name: string;
  start_date: string;       // ISO format date e.g., "2025-08-01"
  end_date: string;         // ISO format date
  total_days: number;
  reason: string;
  STATUS: "approved" | "pending" | "rejected"; // Adjust if other statuses exist
  applied_on: string;       // ISO datetime string
  approved_by: number | null;
  approved_on: string | null; // Nullable for pending leaves
  approver: string | null;
  remarks: string;
  is_active: 0 | 1;
  is_deleted: 0 | 1;
  created_at: string;       // ISO datetime string
  updated_at: string;       // ISO datetime string
};

export type LeaveResponse = {
  status: 0 | 1;
  message: string;
  payload: LeavePayload[];
};