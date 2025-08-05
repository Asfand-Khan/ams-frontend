export type CourierPayloadType = {
  id: 1;
  name: string;
  api_code: string;
  account_number: string;
  user: string;
  password: string;
  book_url: string | null;
  tracking_url: string;
  is_takaful: boolean;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
export type CourierResponseType = {
  status: 1 | 0;
  message: string;
  payload: CourierPayloadType[];
};
