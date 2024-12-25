export const deleteCookies = () => {
  document.cookie = "refresh_token=; Max-Age=0; path=/;"
  document.cookie = "access_token=; Max-Age=0; path=/;"
};

export const deleteAuthStorage = () => {
  localStorage.removeItem("auth-storage");
}