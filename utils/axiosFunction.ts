import axios, { AxiosRequestConfig, Method } from "axios";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { handleLogout } from "./handleLogout";

type axiosParams = {
  method: Method;
  urlPath: string;
  data?: any;
  token?: string;
  isServer?: boolean;
  apiVersion?: boolean;
};

export type axiosReturnType = {
  status: string;
  message: string;
  payload: any;
};

export const axiosFunction = async ({
  method = "GET",
  urlPath = "",
  data = {},
  token = undefined,
  isServer = false,
  apiVersion = false,
}: axiosParams) => {
  const url = apiVersion ? process.env.NEXT_PUBLIC_API_V2_BASE_URL + urlPath : process.env.NEXT_PUBLIC_API_BASE_URL + urlPath;
  const cookieToken = getCookie("orio-attendance-token")?.toString() || null;
  const authToken = cookieToken || token;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : "",
    },
    data,
  };

  try {
    const result: any = await axios(config);
    return result.data;
  } catch (err: any) {
    if (err.status === 401) {
      toast.error("Your session has expired. Please login again.");
      handleLogout();
      window.location.href = `/login`;
    }

    if (err.status === 404) {
      toast.error("API endpoint not found. Please try again.");
    }

    if (isServer === false) {
      return {
        message: err.message,
        payload: [],
        status: "500",
      };
    }

    throw err;
  }
};
