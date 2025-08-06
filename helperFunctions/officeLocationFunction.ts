import { OfficeLocationsResponse } from "@/types/officeLocationTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchOfficeLocationList =
  async (): Promise<OfficeLocationsResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/office-locations",
      });
      return response;
    } catch (err) {
      console.error("Error fetching office location list:", err);
      return null;
    }
  };
