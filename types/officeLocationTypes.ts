export type OfficeLocationPayload = {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  radius_meters: number;
  address: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type OfficeLocationsResponse = {
  status: number;
  message: string;
  payload: OfficeLocationPayload[];
};
