export type EmployeesResponseType = {
  status: number;
  message: string;
  payload: EmployeePayloadType[];
};

export type EmployeePayloadType = {
  id: number;
  employee_code: string;
  full_name: string;
  father_name: string | null;
  email: string;
  phone: string;
  cnic: string | null;
  gender: "male" | "female";
  dob: string;
  join_date: string;
  leave_date: string | null;
  department_id: number;
  designation_id: number;
  profile_picture: string;
  address: string | null;
  status: "active" | "inactive" | string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};
