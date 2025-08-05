import { AgentResponseTypes } from "@/types/agentTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchAgentList = async (): Promise<AgentResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/agents",
    });

    return response;
  } catch (err) {
    console.error("Error fetching agents list:", err);
    return null;
  }
};

export const fetchSingleAgent = async (
  agentId: number
): Promise<AgentResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/agents/${agentId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single agent:", err);
    return null;
  }
};
