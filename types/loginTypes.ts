export type LoginPayloadType = {
  username: string;
};

export type LoginResponseType = {
  status: 1 | 0;
  message: string;
  payload: LoginPayloadType[];
};
