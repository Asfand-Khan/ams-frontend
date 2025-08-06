import { WifiNetworksResponse } from "@/types/wifiNetworkTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchWifiNetworkList =
  async (): Promise<WifiNetworksResponse | null> => {
    try {
      const response = await axiosFunction({
        method: "GET",
        urlPath: "/wifi-networks/all",
      });
      return response;
    } catch (err) {
      console.error("Error fetching wifi network list:", err);
      return null;
    }
  };
