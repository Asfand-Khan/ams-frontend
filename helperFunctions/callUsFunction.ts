import { CallUsResponseType } from "@/types/callUsTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchCallUsList = async (): Promise<CallUsResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/call-us-data",
    });

    return response;
  } catch (err) {
    console.error("Error fetching call us list:", err);
    return null;
  }
};

export const fetchSingleCallUs = async (
  callUsId: number
): Promise<CallUsResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/call-us-data/${callUsId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single call us:", err);
    return null;
  }
};
