export type VerifyOtpResponse = {
  status: number;
  message: string;
  payload: VerifyOtpPayload[];
};

export type VerifyOtpPayload = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  type: string;
  employee_id: number;
  last_login: string | null;
  password_reset_token: string | null;
  otp_token: string | null;
  token_expiry: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  token: string;
  employee: Employee;
  menus?: MenuPermission[]; // Optional with initialization possibility
};

export type Employee = {
  id: number;
  employee_code: string;
  full_name: string;
  father_name: string | null;
  email: string;
  phone: string;
  cnic: string;
  gender: string;
  dob: string;
  join_date: string;
  leave_date: string | null;
  department_id: number;
  designation_id: number;
  profile_picture: string;
  address: string;
  status: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuPermission = {
  menu_id: number;
  menu_name: string;
  icon: string;
  sorting: number;
  url: string;
  parent_id: number | null;
  can_view: string;
  can_create: string;
  can_edit: string;
  can_delete: string;
  items?: MenuPermission[];
};

export type UserInfoTypes = {
  username: string;
  fullname: string;
  employee_id: number;
  user_id: number;
  email: string;
};