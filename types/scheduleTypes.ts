export type MeetingResponse = {
  status: number;
  message: string;
  payload: MeetingPayload[];
};

export type MeetingPayload = {
  id: number;
  title: string;
  recurrence_rule: string;
  recurrence_type: "daily" | "weekly" | "monthly" | string;
  start_time: string;
  end_time: string;
  recurrence_start_date: string;
  recurrence_end_date: string;
  host_id: number;
  location_type: "physical" | "virtual" | string;
  location_details: string;
  agenda: string;
  status: "scheduled" | "cancelled" | "completed" | string;
  meeting_host: MeetingHost;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type MeetingHost = {
  full_name: string;
};

export type MeetingInstancesResponse = {
  status: number;
  message: string;
  payload: MeetingInstancePayload[];
};

export type MeetingInstancePayload = {
  meeting_instance_id: number;
  meeting_id: number;
  instance_date: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "cancelled" | "completed" | string;
  title: string;
  recurrence_rule: string;
  recurrence_type: "daily" | "weekly" | "monthly" | string;
  recurrence_start_date: string;
  recurrence_end_date: string;
  location_type: "physical" | "virtual" | string;
  location_details: string;
  agenda: string;
  host_name: string;
  attendees: string;
  is_active: boolean;
};
