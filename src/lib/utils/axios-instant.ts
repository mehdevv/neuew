import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { getSafeErrorMessage } from "./error-handler";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiBaseUrl && typeof window !== "undefined") {
  console.error("❌ CRITICAL: NEXT_PUBLIC_API_URL is not defined! API requests will fail.");
  console.error("Please set NEXT_PUBLIC_API_URL in your environment variables.");
}

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl || "", // Fallback to empty string to avoid "undefined" string interpolation
  withCredentials: true,
});

// Request interceptor to add Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    // Only add token in client-side (browser) environment
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token expiration and errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only handle in client-side (browser) environment
    if (typeof window !== "undefined") {
      const status = error.response?.status;

      // Check if error is 401 (Unauthorized) - token expired or invalid
      if (status === 401) {
        const authStore = useAuthStore.getState();
        // Only logout if user is logged in (avoid infinite loops)
        if (authStore.token) {
          authStore.logout();
          toast.error("Your session has expired. Please log in again.");
          // Redirect to login page
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }
      }

      // For other errors, we don't show toasts here
      // Let individual components handle errors with handleErrorWithToast
      // This prevents duplicate error messages
    }
    return Promise.reject(error);
  },
);
