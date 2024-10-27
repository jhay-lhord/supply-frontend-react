import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("access");

export const getRoleFromToken = (access_token: string): string => {
  if (access_token) {
    const decodedToken = jwtDecode<any>(access_token);
    return decodedToken.role;
  }
  return "";
};

export const getEmailFromToken = (): string => {
  if (token) {
    const decodedToken = jwtDecode<any>(token);
    return decodedToken.email;
  }
  return "";
};

export const getFullnameFromToken = (): string => {
  if (token) {
    const decodedToken = jwtDecode<any>(token);
    return decodedToken.fullname;
  }
  return "";
};
