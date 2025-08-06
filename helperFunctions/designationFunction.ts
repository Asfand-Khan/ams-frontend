import { DesignationResponse } from "@/types/designationTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchDesignationList =
  async (): Promise<DesignationResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/designations",
      });
      return response;
    } catch (err) {
      console.error("Error fetching designation list:", err);
      return null;
    }
  };
