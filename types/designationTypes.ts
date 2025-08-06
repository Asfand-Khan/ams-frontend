export type Department = {
  name: string;
};

export type DesignationPayload = {
  id: number;
  title: string;
  level: number;
  description: string;
  department_id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_deleted: boolean;
  department: Department | null;
};

export type DesignationResponse = {
  status: 1;
  message: string;
  payload: DesignationPayload[];
};
