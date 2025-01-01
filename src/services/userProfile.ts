import useAuthStore from "@/components/Auth/AuthStore";

export const useGetUserInformation = () => {
  const { user } = useAuthStore();
  const userRole = user?.role;
  const userEmail = user?.email;
  const userFirstName = user?.first_name;
  const userLastName = user?.last_name;
  const trimmedUserRole = (role = userRole) =>
    role
      ?.split(" ")
      .map((word) => word[0])
      .join("");

  return { userEmail, userFirstName, userLastName, userRole, trimmedUserRole };
};
