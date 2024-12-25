import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/api";
import { AxiosError } from "axios";
import { deleteAuthStorage, deleteCookies } from "@/utils/deleteCookies";

export interface User {
  email: string;
  fullname: string;
  role?: string;
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
  logout: (onSuccess?: (succes: string) => void, onError?: (error: string) => void ) => Promise<void>;
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
          console.log("Already authenticated");
          return; // Skip check if already authenticated
        }
        set({ isLoading: true });
        try {
          console.log("Checking authentication...");
          const response = await api.get("/api/user/check_auth");
          const { email, role, fullname } = response.data;
          set({ isAuthenticated: true, user: { email, role, fullname } });
        } catch (error) {
          set({ isAuthenticated: false, user: null });
          localStorage.removeItem('auth-storage');
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
            user: response.data.user,
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

      logout: async (onSuccess?: (succes: string) => void, onError?: (error: string) => void) => {
        set({ isLoading: true });

        const clearState = () => {
          set({
            isAuthenticated: false,
            otpSent: false,
            user: null,
            email: null,
            errorMessage: null,
            successMessage: null,
            isLoading: false
          });
          deleteAuthStorage()
          deleteCookies()
          
        };

        try {
          const response = await api.post("/api/user/logout/");

          clearState();
          // await get().checkAuth();
          window.location.href = "/login";
          onSuccess?.(response?.data?.message);
        } catch (error) {
          console.error("Logout error:", error);
          const errorMsg = error instanceof Error ? error.message : "An unknown error occurred during logout";
          onError?.(errorMsg);
          set({ isLoading: false });
          clearState(); 
        }
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

