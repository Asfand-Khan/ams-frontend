export type Department = {
  name: string;
}

export type Designation = {
  title: string;
}

export type EmployeeInfo = {
  id: number;
  employee_code: string;
  full_name: string;
  father_name: string;
  email: string;
  phone: string;
  cnic: string;
  gender: string;
  dob: string; // ISO date string
  join_date: string; // ISO date string
  leave_date: string | null;
  department_id: number;
  designation_id: number;
  profile_picture: string;
  address: string;
  status: string;
  is_active: boolean;
  is_deleted: boolean;
  department: Department;
  designation: Designation;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
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
