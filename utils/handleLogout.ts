import { deleteCookie } from "cookies-next";

export const handleLogout = () => {
  deleteCookie("orio-attendance-token");
  deleteCookie("userInfo");
  localStorage.removeItem("menus");
};
