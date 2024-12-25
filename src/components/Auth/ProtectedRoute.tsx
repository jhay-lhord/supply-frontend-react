import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore, { User } from "./AuthStore";

type ProtectedRouteProps =  {
  allowedRoles?: User["role"][];
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles?.includes(user?.role || "")) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;

};

export default ProtectedRoutes;
