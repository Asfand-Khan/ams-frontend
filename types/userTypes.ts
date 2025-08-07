export type EmployeeInfo = {
  full_name: string;
};

export type UserPayload = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  type: "admin" | "hr" | "lead" | "employee";
  employee_id: number;
  last_login: string | null;
  password_reset_token: string | null;
  otp_token: string | null;
  token_expiry: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  employee: EmployeeInfo;
};

export type UsersResponse = {
  status: number; // 1 = success
  message: string; // e.g., "All users fetched successfully"
  payload: UserPayload[];
};
