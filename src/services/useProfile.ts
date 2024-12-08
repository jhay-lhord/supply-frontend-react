import { ACCESS_TOKEN } from "@/constants";
import {
  getEmailFromToken,
  getFullnameFromToken,
  getRoleFromToken,
} from "@/utils/jwtHelper";

const access_token = localStorage.getItem(ACCESS_TOKEN);
export const userRole = getRoleFromToken(access_token!);
export const userEmail = getEmailFromToken(access_token!);
export const userFullname = getFullnameFromToken(access_token!);
export const trimmedUserRole = (user_role: string) => {
  return (
    user_role &&
    user_role
      .split(" ")
      .map((word) => word[0])
      .join("")
  );
};
