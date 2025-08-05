export interface LeaveTypePayload {
  id: number;
  name: string;
  total_quota: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeaveTypeResponse {
  status: number;
  message: string;
  payload: LeaveTypePayload[];
}
