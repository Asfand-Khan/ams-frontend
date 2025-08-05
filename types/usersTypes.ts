// user

export type UsersListPayloadType = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  image: string;
  username: string;
  user_type: string;
  is_admin: boolean;
  is_active: boolean;
  is_deleted: boolean;
  email_verified_at: string;
  failed_attempt: number;
  lock_time: number | null;
  last_login_date: string;
  last_password_change: number | null;
  is_locked: boolean;
  otp_token: number | null;
  otp_time: number | null;
  password: string;
  remember_token: number | null;
  created_by: number | null;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: number | null;
};

export type UsersListResponseType = {
  status: 1 | 0;
  message: string;
  payload: UsersListPayloadType[];
};

// api user

export type ApiUsersPayloadType = {
  id: number;
  name: string;
  api_password: string;
  email: string;
  phone: string;
  api_key: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number | null;
  deleted_by: number | null;
  user_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ApiUsersResponseType = {
  status: 1 | 0;
  message: string;
  payload: ApiUsersPayloadType[];
};

// user profile

export type UserProfilePayloadType = {
  id: number;
  username: string;
  fullname: string;
  email: string;
  contact: string;
  image: string;
  isActive: boolean;
  lastLoginDate: string;
};

export type UserProfileResponseType = {
  status: 1 | 0;
  message: string;
  payload: UserProfilePayloadType[];
};

// add user

export type UserPayloadType = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  image: string;
  username: string;
  user_type: string;
  is_admin: boolean;
  is_active: boolean;
  is_deleted: boolean;
  email_verified_at: string;
  failed_attempt: number;
  lock_time: string;
  last_login_date: string;
  last_password_change: string;
  is_locked: boolean;
  otp_token: string;
  otp_time: string;
  password: string;
  remember_token: string;
  created_by: number;
  deleted_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type UserResponseType = {
  status: 1 | 0;
  message: string;
  payload: UserPayloadType[];
};

// single user

export type MenuTypes = {
  id: number;
  name: string;
  description: string;
  parent_id: number;
  url: string;
  icon: string;
  sorting: number;
  created_by: number;
  deleted_by: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export type rightsType = {
  id: number;
  user_id: number;
  menu_id: number;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  created_at: string;
  updated_at: string;
  menu: MenuTypes;
};
export type SingleUserPayloadType = {
  id: number;
  username: string;
  fullname: string;
  email: string;
  contact: string;
  image: string;
  is_active: boolean;
  is_locked: boolean;
  user_type: string;
  rights: rightsType[];
};

export type SingleUserResponseType = {
  status: 1 | 0;
  message: string;
  payload: SingleUserPayloadType[];
};

// edit user response (reuse UserResponseType for now)
export type EditUserResponseType = UserResponseType;
