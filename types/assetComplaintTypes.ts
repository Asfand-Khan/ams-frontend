export type AssetComplaintPayload = {
  id: number;
  employee_id: number;
  requested_by_employee: {
    full_name: string;
  };
  reviewed_by: number | null;
  request_type: "complaint" | "repair" | string;
  category: string;
  asset_type: string;
  reason: string;
  status: "pending" | "resolved" | string;
  requested_at: string;
  reviewed_at: string | null;
  resolution_remarks: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type AssetComplaintsResponse = {
  status: number;
  message: string;
  payload: AssetComplaintPayload[];
};
