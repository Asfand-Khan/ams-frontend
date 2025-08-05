import { CityResponseType } from "@/types/cityTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchCityList = async (): Promise<CityResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/cities",
    });

    return response;
  } catch (err) {
    console.error("Error fetching cities list:", err);
    return null;
  }
};

export const fetchSingleCity = async (
  cityId: number
): Promise<CityResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/cities/${cityId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single city:", err);
    return null;
  }
};
