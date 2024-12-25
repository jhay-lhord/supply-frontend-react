export const deleteCookies = () => {
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const deleteAuthStorage = () => {
  localStorage.removeItem("auth-storage");
}