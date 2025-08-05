import { BusinessRegionResponseType } from "./../types/businessRegionTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchBusinessRegionList =
  async (): Promise<BusinessRegionResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/business-regions",
      });

      return response;
    } catch (err) {
      console.error("Error fetching business region list:", err);
      return null;
    }
  };

export const fetchSingleBusinessRegion = async (
  businessRegionId: number
): Promise<BusinessRegionResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/business-regions/${businessRegionId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single business region:", err);
    return null;
  }
};
