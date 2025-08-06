export type DepartmentPayload = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type DepartmentResponse = {
  status: 1;
  message: string;
  payload: DepartmentPayload[];
};
