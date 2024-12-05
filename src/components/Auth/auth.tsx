import Register from "@/pages/Forms/Register";
import { Navigate } from "react-router-dom";


export const Logout = () => {
  localStorage.clear();
  window.location.reload()
  return <Navigate to="/login" />;
};

export const RegisterAndLogout = () => {
  localStorage.clear();
  return <Register />;
};