import { TeamsResponse } from "@/types/teamTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchTeamsList = async (): Promise<TeamsResponse | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/teams",
    });
    return response;
  } catch (err) {
    console.error("Error fetching team list:", err);
    return null;
  }
};
