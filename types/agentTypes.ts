export type AgentPayloadTypes = {
  id: number;
  name: string;
  igis_code: string;
  igis_agent_code: string;
  branch_id: number;
  development_officer_id: number;
  idev_affiliate: boolean;
  idev_id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type AgentResponseTypes = {
  status: 1 | 0;
  message: string;
  payload: AgentPayloadTypes[];
};
