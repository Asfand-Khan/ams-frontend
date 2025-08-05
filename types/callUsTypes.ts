export type CallUsPayloadType = {
  id: number;
  name: string;
  contact: string;
  email: string;
  is_active: boolean;
  created_by: number;
  deleted_by: number | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
export type CallUsResponseType = {
  status: 1 | 0;
  message: string;
  payload: CallUsPayloadType[];
};
