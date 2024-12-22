import { create } from "zustand";
import api from "@/api";
import { AxiosError } from "axios";

interface User {
  email: string;
  fullname: string;
  role: string;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  otpSent: boolean;
  user: User | null;
  email: string | null;
  errorMessage: string | null;
  successMessage: string | null;
  checkAuth: () => Promise<void>;
  checkUser: (
    email: string,
    password: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => Promise<void>;
  verifyOTP: (
    email: string,
    otp: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  isAuthenticated: false,
  otpSent: false,
  user: null,
  email: null,
  errorMessage: null,
  successMessage: null,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/api/user/");
      const email_ = response.data.email;
      const role = response.data.role;
      const fullname = response.data.fullname;
      console.log("Authentication check successful:", response);
      set({ isAuthenticated: true, user: {email:email_, role: role, fullname:fullname}, });
    } catch (error) {
      set({ isAuthenticated: false });
      console.error("Authentication check failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  checkUser: async (email, password, onSuccess, onError) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/api/user/login_token/", {
        email,
        password,
      });
      console.log("User check successful:", response.data);

      set({
        otpSent: true,
        email: response.data.email,
        errorMessage: null,
        successMessage: response.data.message,
      });

      // Trigger the success callback
      if (onSuccess) onSuccess(response.data.message);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError;
      const errorMsg =
        (axiosError.response?.data as { error?: string })?.error ||
        "Failed to check user. Please try again.";
      console.error("User check failed:", errorMsg);

      set({ otpSent: false, errorMessage: errorMsg });

      // Trigger the error callback
      if (onError) onError(errorMsg);
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOTP: async (email, otp_code, onSuccess, onError) => {
    try {
      const response = await api.post("/api/user/login_verify_otp/", {
        email,
        otp_code,
      });

      console.log("OTP verification successful:", response.data);
      set({
        isAuthenticated: true,
        otpSent: false,
        errorMessage: null,
        user: response.data, // Assuming the API returns user details on successful OTP verification
      });
      if (onSuccess) onSuccess(response.data.message);
    } catch (error: any) {
      console.log(error);
      const axiosError = error as AxiosError;
      const errorMsg =
        (axiosError.response?.data as { error?: string })?.error ||
        "Failed to verify the token. Please try again.";
      console.error("User check failed:", errorMsg);

      set({ otpSent: false, errorMessage: errorMsg });

      // Trigger the error callback
      if (onError) onError(errorMsg);
    }
  },
}));

export default useAuthStore;
