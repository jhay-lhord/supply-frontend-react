import useAuthStore from "@/components/Auth/authStore";

export const useGetUserInformation = () => {
  const { user } = useAuthStore();
  const userRole = user?.role;
  const userEmail = user?.email
  const userFullname = user?.fullname
  const trimmedUserRole = (role = userRole) => 
    role?.split(" ")
    .map((word) => word[0])
    .join("");

  return { userEmail, userFullname, userRole, trimmedUserRole };
};
