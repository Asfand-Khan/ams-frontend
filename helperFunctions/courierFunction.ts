import { CourierResponseType } from "@/types/courierTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchCourierList = async (): Promise<CourierResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/couriers",
    });

    return response;
  } catch (err) {
    console.error("Error fetching couriers list:", err);
    return null;
  }
};

export const fetchSingleCourier = async (
  courierId: number
): Promise<CourierResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/couriers/${courierId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single courier:", err);
    return null;
  }
};
