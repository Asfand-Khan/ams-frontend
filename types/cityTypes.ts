export type CityPayloadType = {
  id: number;
  country_id: number;
  igis_city_code: string;
  city_name: string;
  city_code: string;
  priority: number;
  is_tcs: boolean;
  is_blueEx: boolean;
  is_leopard: boolean;
  is_active: boolean;
  created_by: number;
  deleted_by: number | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
export type CityResponseType = {
  status: 1 | 0;
  message: string;
  payload: CityPayloadType[];
};
