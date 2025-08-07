import { AssetComplaintsResponse } from "@/types/assetComplaintTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchAssetComplaintList =
  async (): Promise<AssetComplaintsResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "POST",
        urlPath: "/asset-complaints/all",
        data: {},
      });
      return response;
    } catch (err) {
      console.error("Error fetching asset complaint list:", err);
      return null;
    }
  };
