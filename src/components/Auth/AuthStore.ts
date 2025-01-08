import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "@/api";
import { AxiosError } from "axios";
import { deleteAuthStorage, deleteCookies } from "@/utils/deleteCookies";
import { userUpdatePasswordType, userUpdateType } from "@/types/request/user";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
}

interface AuthState {
  isLoading: boolean;
  isLoggingOut: boolean;
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
  updateUser: (
    id: number,
    data: userUpdateType,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => Promise<void>;
  updateUserPassword: (
    data: userUpdatePasswordType,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => Promise<void>;
  verifyOTP: (
    email: string,
    otp: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => Promise<void>;
  resendOTP: (
    email: string,
    onSuccess?: (message: string) => void,
    onError?: (error: string) => void
  ) => Promise<void>;
  logout: (
    onSuccess?: (succes: string) => void,
    onError?: (error: string) => void
  ) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      isLoggingOut: false,
      isAuthenticated: false,
      otpSent: false,
      user: null,
      email: null,
      errorMessage: null,
      successMessage: null,

      checkAuth: async () => {
        if (get().isAuthenticated && get().user) {
          console.log("Already authenticated");
          return;
        }
        set({ isLoading: true });
        try {
          console.log("Checking authentication...");
          const response = await api.get("/api/user/check_auth");
          console.log(response.data.user);
          set({ isAuthenticated: true, user: response.data.user });
        } catch (error) {
          set({ isAuthenticated: false, user: null });
          localStorage.removeItem("auth-storage");
          console.error("Authentication check failed:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      checkUser: async (email, password, onSuccess, onError) => {
        set({ isLoading: true, errorMessage: null, successMessage: null });
        deleteAuthStorage();
        deleteCookies();
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

      updateUser: async (id, data, onSuccess, onError) => {
        set({ isLoading: true, errorMessage: null, successMessage: null });
        try {
          const response = await api.put(`/api/user/${id}/edit/`, data);
          set({
            user: response.data.user,
            successMessage: response.data.message,
          });
          onSuccess?.(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError;
          const errorMsg =
            (axiosError.response?.data as { error?: string })?.error ||
            "Something went wrong. Please try again.";
          set({ otpSent: false, errorMessage: errorMsg });
          onError?.(errorMsg);
        } finally {
          set({ isLoading: false });
        }
      },

      updateUserPassword: async (data, onSuccess, onError) => {
        set({ isLoading: true, errorMessage: null, successMessage: null });
        try {
          const response = await api.post(`/api/user/change-password/`, data);
          onSuccess?.(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError;
          const errorMsg =
            (axiosError.response?.data as { error?: string })?.error ||
            "Something went wrong. Please try again.";
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
          console.log(response.data.user);
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
      resendOTP: async (
        email: string,
        onSuccess?: (message: string) => void,
        onError?: (error: string) => void
      ) => {
        set({ isLoading: true, errorMessage: null, successMessage: null });
        try {
          const response = await api.post("api/user/login_resend_otp/", {
            email,
          });
          set({ successMessage: response.data.message });
          onSuccess?.(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError;
          const errorMsg =
            (axiosError.response?.data as { error?: string })?.error ||
            "Failed to resend OTP. Please try again.";
          set({ errorMessage: errorMsg });
          onError?.(errorMsg);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async (
        onSuccess?: (succes: string) => void,
        onError?: (error: string) => void
      ) => {
        set({ isLoggingOut: true });

        const clearState = () => {
          set({
            isAuthenticated: false,
            otpSent: false,
            user: null,
            email: null,
            errorMessage: null,
            successMessage: null,
            isLoggingOut: false,
          });
          deleteAuthStorage();
          deleteCookies();
        };

        try {
          const response = await api.post("/api/user/logout/");

          clearState();
          set({ isLoggingOut: false });
          onSuccess?.(response?.data?.message);
          window.location.href = "/login";
        } catch (error) {
          console.error("Logout error:", error);
          const errorMsg =
            error instanceof Error
              ? error.message
              : "An unknown error occurred during logout";
          onError?.(errorMsg);
          set({ isLoggingOut: false });
          clearState();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
