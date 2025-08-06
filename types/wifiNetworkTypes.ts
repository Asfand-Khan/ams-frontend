export type WifiNetworkPayload = {
  id: number;
  name: string;
  password: string;
  notes: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type WifiNetworksResponse = {
  status: number;
  message: string;
  payload: WifiNetworkPayload[];
};