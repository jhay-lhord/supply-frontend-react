import { useState, useEffect } from "react";
import { getRoleFromToken } from "@/utils/jwtHelper";

export const useAuth = () => {
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const userRole: string = getRoleFromToken();
    console.log(`Mao ni ang Role niya: ${userRole}`)
    setRole(userRole);
  }, []);

  return { role };
};
