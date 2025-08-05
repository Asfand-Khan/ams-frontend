export type BusinessRegionPayloadType = {
  id: number;
  business_region_name: string;
  igis_business_region_code: string;
  is_active: boolean;
  created_by: number;
  deleted_by: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
export type BusinessRegionResponseType = {
  status: 1 | 0;
  message: string;
  payload: BusinessRegionPayloadType[];
};
