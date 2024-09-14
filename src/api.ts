import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"; // Assume you store the refresh token as well

const api = axios.create({
  baseURL: import.meta.env.VITE_RENDER_API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to attach the access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token has expired and we haven't already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the requests while the token is being refreshed
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      console.log(refreshToken)

      if (!refreshToken) {
        // If no refresh token, log the user out or handle accordingly
        return Promise.reject(error);
      }

      // Try refreshing the token
      return new Promise(function (resolve, reject) {
        axios
          .post(`${import.meta.env.VITE_RENDER_API_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          })
          .then(({ data }) => {
            console.log(data.access)
            localStorage.setItem(ACCESS_TOKEN, data.access);
            api.defaults.headers.Authorization = `Bearer ${data.access}`;
            originalRequest.headers.Authorization = `Bearer ${data.access}`;
            processQueue(null, data.access );
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
            console.log(err)
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
