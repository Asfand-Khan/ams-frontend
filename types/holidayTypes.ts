export interface HolidayResponse {
  status: number;
  message: string;
  payload: HolidayPayload[];
}

export interface HolidayPayload {
  id: number;
  holiday_date: string;
  title: string;
  description: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
