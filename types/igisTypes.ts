export type IgisSubMakePayloadType = {
  id: number;
  make_id: number;
  sub_make_name: string;
  igis_sub_make_code: string;
  seating_capacity: number;
  cubic_capacity: string;
  coi_type_code: string;
  is_active: boolean;
  created_by: number;
  deleted_by: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
export type IgisSubMakeResponseType = {
  status: 1 | 0;
  message: string;
  payload: IgisSubMakePayloadType[];
};


export type IgisMakePayloadType = {
  id: number;
  make_name: string;
  igis_make_code: string;
  is_active: boolean;
  created_by: number;
  deleted_by: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
export type IgisMakeResponseType = {
  status: 1 | 0;
  message: string;
  payload: IgisMakePayloadType[];
};
