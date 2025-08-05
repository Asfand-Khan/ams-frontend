import { IgisMakeResponseType, IgisSubMakeResponseType } from "@/types/igisTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchIgisMakeList = async () => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/igis-makes",
    });
    return response;
  } catch (err) {
    console.error("Error fetching igis makes list:", err);
    return null;
  }
};

export const fetchSingleIgisMake = async (
  igisMakeId: number
): Promise<IgisMakeResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/igis-makes/${igisMakeId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single igis makes:", err);
    return null;
  }
};

export const fetchIgisSubMakeList = async () => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/igis-sub-makes",
    });
    return response;
  } catch (err) {
    console.error("Error fetching igis sub makes list:", err);
    return null;
  }
};

export const fetchSingleIgisSubMake = async (
  igisSubMakeId: number
): Promise<IgisSubMakeResponseType | null> => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: `/igis-sub-makes/${igisSubMakeId}`,
    });

    return response;
  } catch (err) {
    console.error("Error fetching single igis sub makes:", err);
    return null;
  }
};
