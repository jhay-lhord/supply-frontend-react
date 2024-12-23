import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      isAuthenticated: false,
      otpSent: false,
      user: null,
      email: null,
      errorMessage: null,
      successMessage: null,

      checkAuth: async () => {
        if (get().isAuthenticated && get().user) {
          return; // Skip check if already authenticated
        }
        set({ isLoading: true });
        try {
          const response = await api.get("/api/user/");
          const { email, role, fullname } = response.data;
          set({ isAuthenticated: true, user: { email, role, fullname } });
        } catch (error) {
          set({ isAuthenticated: false, user: null });
          console.error("Authentication check failed:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      checkUser: async (email, password, onSuccess, onError) => {
        set({ isLoading: true, errorMessage: null, successMessage: null });
        try {
          const response = await api.post("/api/user/login_token/", {
            email,
            password,
          });
          set({
            otpSent: true,
            email: response.data.email,
            successMessage: response.data.message,
          });
          onSuccess?.(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError;
          const errorMsg =
            (axiosError.response?.data as { error?: string })?.error ||
            "Failed to check user. Please try again.";
          set({ otpSent: false, errorMessage: errorMsg });
          onError?.(errorMsg);
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOTP: async (email, otp_code, onSuccess, onError) => {
        set({ isLoading: true, errorMessage: null, successMessage: null });
        try {
          const response = await api.post("/api/user/login_verify_otp/", {
            email,
            otp_code,
          });
          set({
            isAuthenticated: true,
            otpSent: false,
            user: response.data,
          });
          onSuccess?.(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError;
          const errorMsg =
            (axiosError.response?.data as { error?: string })?.error ||
            "Failed to verify the token. Please try again.";
          set({ otpSent: false, errorMessage: errorMsg });
          onError?.(errorMsg);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          otpSent: false,
          user: null,
          email: null,
          errorMessage: null,
          successMessage: null,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;

