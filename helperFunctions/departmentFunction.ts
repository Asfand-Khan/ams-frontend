import { DepartmentResponse } from "@/types/departmentTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchDepartmentList =
  async (): Promise<DepartmentResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/departments",
      });
      return response;
    } catch (err) {
      console.error("Error fetching department list:", err);
      return null;
    }
  };
