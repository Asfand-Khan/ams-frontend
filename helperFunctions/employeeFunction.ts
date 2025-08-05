import { EmployeesResponseType } from "@/types/employeeTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchEmployeeList =
  async (): Promise<EmployeesResponseType | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/employees",
      });

      return response;
    } catch (err) {
      console.error("Error fetching employee list:", err);
      return null;
    }
  };