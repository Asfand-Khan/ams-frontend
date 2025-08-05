export type ClientPayloadType = {
  id: number;
  name: string;
  igis_client_code: string;
  address: string;
  telephone: string;
  contact_person: string;
  branch_id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};
export type ClientResponseType = {
  status: 1 | 0;
  message: string;
  payload: ClientPayloadType[];
};
