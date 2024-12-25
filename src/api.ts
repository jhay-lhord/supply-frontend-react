import axios from "axios";

const react_env = import.meta.env.VITE_REACT_ENV;
const development_url = import.meta.env.VITE_API_URL;
const production_url = import.meta.env.VITE_RENDER_API_URL;

console.log(`Running in ${react_env} Mode`);

const baseURL = react_env === "development" ? development_url : production_url;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Request interceptor (optional if no additional headers are required)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token is expired and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh endpoint to get a new access token
        const response = await axios.post(
          `${baseURL}/api/token/refresh/`,
          {},
          { withCredentials: true }
        );

        // Store the new access token (e.g., in cookies or localStorage)
        const { access_token } = response.data; // Assuming your refresh endpoint returns the new token
        document.cookie = `access_token=${access_token}; path=/;`;

        // Update the original request headers with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Optionally handle user logout if refresh fails
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
