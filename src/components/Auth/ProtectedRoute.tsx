import { Navigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import api from "../../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(true);

  console.log('from protected route')

  useEffect(() => {
    const checkAuth = () => {
      try {
        auth();
      } catch (error) {
        console.error(error);
      } finally {
        setIsloading(false);
      }
    };
    checkAuth();
  }, []);

  const refresh_token = async () => {
    const refresh_token = localStorage.getItem(REFRESH_TOKEN);
    console.log('trying to refresh the token')
    try {
      const request = await api.post("/api/token/refresh/", {
        refresh: refresh_token,
      });
      if (request.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, request.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
      console.error(error);
    }
  };

  const auth = async () => {
    const access_token = localStorage.getItem("access");

    if (!access_token) {
      return setIsAuthorized(false);
    }

    const decoded_token = jwtDecode<JwtPayload>(access_token);
    const tokenExpiration: number | undefined = decoded_token?.exp;
    const nowInSeconds: number = Date.now() / 1000;
    const isTokenExpired = tokenExpiration && tokenExpiration < nowInSeconds;
    console.log(`The Token is Expired: ${isTokenExpired}`)
    if (!isTokenExpired) {
      setIsAuthorized(true);
    } else {
      await refresh_token();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthorized && children 
};

export default ProtectedRoute;
