export type ShiftPayload = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  grace_minutes: number;
  half_day_hours: string;
  early_leave_threshold_minutes: number;
  break_duration_minutes: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type ShiftsResponse = {
  status: number;
  message: string;
  payload: ShiftPayload[];
};
