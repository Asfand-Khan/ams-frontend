import { DevelopmentOfficerResponseTypes } from "@/types/developmentOfficerTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchDevelopmentOfficerList =
  async (): Promise<DevelopmentOfficerResponseTypes | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/development-officers",
      });

      return response;
    } catch (err) {
      console.error("Error fetching development-officers list:", err);
      return null;
    }
  };

export const fetchSingleDevelopmentOfficer = async (
  developmentOfficerId: number
): Promise<DevelopmentOfficerResponseTypes | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/development-officers/${developmentOfficerId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single development officers:", err);
    return null;
  }
};
