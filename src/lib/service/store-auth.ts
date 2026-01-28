// export async function storeSignup(
//   email: string,
//   password: string,
//   confirmPassword: string,
// ) {
//   console.log("NOT IMPLEMENTED", email, password, confirmPassword);
//   alert("NOT IMPLEMENTED");
// }

import { axiosInstance } from "../utils/axios-instant";
import { apiCall } from "../utils/error-handler";

export type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: number;
    name?: string;
    storeuser_id: number;
    profile_photo_url: string;
    storeuser: {
      id: number;
      abn_expires_at: string;
    };
  };
};

export async function storeLogin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiCall(
    () =>
      axiosInstance.post<LoginResponse>("api/auth/in", {
        email,
        password,
        model: "stores",
      }),
    {
      onError: "throw",
      errorMessage: "Failed to log in",
    },
  ).then((res) => res.data);
}

export type TravelerLoginResponse = {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    is_verified: boolean;
    profile_photo_path: string | null;
    created_at: string;
    updated_at: string;
    google_id: string | null;
    email_verified_at: string | null;
  };
};

export async function travelerLogin(
  email: string,
  password: string,
): Promise<TravelerLoginResponse> {
  return apiCall(
    () =>
      axiosInstance.post<TravelerLoginResponse>("api/auth/in", {
        email,
        password,
        model: "voyageurs",
      }),
    {
      onError: "throw",
      errorMessage: "Failed to log in",
    },
  ).then((res) => res.data);
}

export async function travelerSignup(
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
  phone: string,
): Promise<number> {
  return apiCall(
    () =>
      axiosInstance.post("api/auth/onboard/voyageur", {
        name,
        email,
        password,
        password_confirmation,
        phone,
      }),
    {
      onError: "throw",
      errorMessage: "Failed to sign up",
    },
  ).then((res) => res.status);
}

/**
 * Initiates Google OAuth flow for travelers
 * Fetches the Google OAuth redirect URL from the backend and redirects to it
 */
export async function initiateTravelerGoogleAuth() {
  if (typeof window === "undefined") return;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("API URL not configured");
  }

  const response = await apiCall(
    () => axiosInstance.get<{ url: string }>("api/auth/google/redirect"),
    {
      onError: "throw",
      errorMessage: "Failed to initiate Google authentication",
    },
  );

  if (!response.data.url) {
    throw new Error("Invalid response: missing URL");
  }

  // Redirect to the Google OAuth URL
  window.location.href = response.data.url;
}

/**
 * Requests a password reset email
 * @param email - User's email address
 * @param model - User model type: "stores" or "voyageurs"
 */
export async function requestPasswordReset(
  email: string,
  model: "stores" | "voyageurs" = "voyageurs",
): Promise<{ message: string }> {
  return apiCall(
    () =>
      axiosInstance.post<{ message: string }>("api/auth/forgot-password", {
        email,
        model,
      }),
    {
      onError: "throw",
      errorMessage: "Failed to request password reset",
    },
  ).then((res) => res.data);
}

/**
 * Resets password with token, email, password, and password confirmation
 * @param token - Reset token from email link
 * @param email - User's email address
 * @param password - New password
 * @param password_confirmation - Password confirmation
 * @param model - User model type: "stores" or "voyageurs"
 */
export async function resetPassword(
  token: string,
  email: string,
  password: string,
  password_confirmation: string,
  model: "stores" | "voyageurs" = "voyageurs",
): Promise<{ message: string }> {
  return apiCall(
    () =>
      axiosInstance.post<{ message: string }>("api/auth/reset-password", {
        token,
        email,
        password,
        password_confirmation,
        model,
      }),
    {
      onError: "throw",
      errorMessage: "Failed to reset password",
    },
  ).then((res) => res.data);
}
