import { axiosFunction } from "@/utils/axiosFunction";

export const fetchAllMenus = () => {
  try {
    const response = axiosFunction({
      method: "GET",
      urlPath: "/menus",
    });
    return response
  } catch (err) {
    console.error('Error fetching all menus', err)
    return null
  }
};
