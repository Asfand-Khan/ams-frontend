import { SingleUserResponseType } from "@/types/usersTypes";
import { axiosFunction } from "@/utils/axiosFunction";

export const fetchUserList = async () => {
  try {
    const response = await axiosFunction({
      method: "GET",
      urlPath: "/users",
    });

    return response;
  } catch (err) {
    console.error("Error fetching users list:", err);
    return null;
  }
};

export const fetchApiUserList = async () => {
  try {
    const response = axiosFunction({
      method: "GET",
      urlPath: "/api-users",
    });
    return response;
  } catch (err) {
    console.error("Error fetching api users list:", err);
    return null;
  }
};

export const fetchUserProfile = () => {
  try {
    const response = axiosFunction({
      method: "GET",
      urlPath: "/users/my-profile",
    });

    return response;
  } catch (err) {
    console.error("Error fetching api users list:", err);
    return null;
  }
};

export const fetchSingleUser = async (
  userId: number | null
): Promise<SingleUserResponseType | null> => {
  try {
    const response = axiosFunction({
      method: "GET",
      urlPath: `/users/${userId}`,
    });
    return response;
  } catch (err) {
    console.error("Error fetching single user", err);
    return null;
  }
};
