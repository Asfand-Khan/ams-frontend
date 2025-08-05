export type DevelopmentOfficerPayloadTypes = {
  id: number;
  branch_id: number;
  name: string;
  igis_do_code: string;
  igis_code: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DevelopmentOfficerResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: DevelopmentOfficerPayloadTypes[];
};
