import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = (): string => {
  const token = localStorage.getItem("access");

  if (token) {
    const decodedToken = jwtDecode<any>(token);
    return decodedToken.role ;
  }
  return '';
};

export const getEmailFromToken = (): string => {
  const token = localStorage.getItem("access");

  if (token) {
    const decodedToken = jwtDecode<any>(token);
    return decodedToken.email ;
  }
  return '';
};
