export interface TeamPayload {
  id: number;
  name: string;
  description: string;
  team_lead_id: number;
  department_id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamsResponse {
  status: number;
  message: string;
  payload: TeamPayload[];
}
