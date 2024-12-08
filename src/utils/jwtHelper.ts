import { jwtDecode } from "jwt-decode";


export const getRoleFromToken = (access_token: string): string => {
  if (access_token) {
    const decodedToken = jwtDecode<any>(access_token);
    return decodedToken.role;
  }
  return "";
};

export const getEmailFromToken = (access_token:string): string => {
  if (access_token) {
    const decodedToken = jwtDecode<any>(access_token);
    return decodedToken.email;
  }
  return "";
};

export const getFullnameFromToken = (access_token:string): string => {
  if (access_token) {
    const decodedToken = jwtDecode<any>(access_token);
    return decodedToken.fullname;
  }
  return "";
};
