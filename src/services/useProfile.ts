import { ACCESS_TOKEN } from "@/constants";
import {
  getEmailFromToken,
  getFullnameFromToken,
  getRoleFromToken,
} from "@/utils/jwtHelper";

export const getUserInformation = () => {
  const token = localStorage.getItem(ACCESS_TOKEN)
  const userRole = getRoleFromToken(token!);
  const userEmail = getEmailFromToken(token!);
  const userFullname = getFullnameFromToken(token!);
  const trimmedUserRole = userRole
    .split(" ")
    .map((word) => word[0])
    .join("");

  return { userEmail, userFullname, trimmedUserRole };
};
