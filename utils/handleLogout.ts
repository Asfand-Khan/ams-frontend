import { deleteCookie } from "cookies-next";

export const handleLogout = () => {
  deleteCookie("orio-attendance-token", { path: "/" });
  deleteCookie("userInfo", { path: "/" });
  localStorage.removeItem("menus");
  localStorage.removeItem("userInfo");
};