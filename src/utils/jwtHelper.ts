import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = (): string => {
  const token = localStorage.getItem("access");
  console.log(`Tokrn ni siya: ${token}`)

  if (token) {
    const decodedToken = jwtDecode<any>(token);
    console.log(decodedToken)
    console.log(decodedToken.role);
    return decodedToken.role ;
  }
  return '';
};

export const getEmailFromToken = (): string => {
  const token = localStorage.getItem("access");
  console.log(`Tokrn ni siya: ${token}`)

  if (token) {
    const decodedToken = jwtDecode<any>(token);
    console.log(decodedToken)
    console.log(decodedToken.email);
    return decodedToken.email ;
  }
  return '';
};
