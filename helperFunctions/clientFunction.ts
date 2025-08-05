import { ClientResponseType } from "@/types/clientTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchClientList = async ():Promise<ClientResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/clients",
    });

    return response;
  } catch (err) {
    console.error("Error fetching clients list:", err);
    return null;
  }
};

export const fetchSingleClient = async (clientId: number):Promise<ClientResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/clients/${clientId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single clients", err);
    return null;
  }
};
