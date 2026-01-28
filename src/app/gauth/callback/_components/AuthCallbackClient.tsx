"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

type AuthCallbackClientProps = {
  accessToken: string;
};

export default function AuthCallbackClient({
  accessToken,
}: AuthCallbackClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileAndLogin() {
      if (!accessToken) {
        toast.error("No token provided");
      router.push("/auth/login");
      return;
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL not configured");
        }

        // Fetch user profile from the API (client-side)
        const response = await fetch(`${apiUrl}/api/voyageurs/voyageur/info`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const profileData = await response.json();

        if (!profileData || !profileData.data) {
          throw new Error("Invalid profile data received");
        }

      const user = profileData.data;

        if (!user || !user.id || !user.email) {
          throw new Error("Invalid user data");
        }

      const loginData = {
        message: "Login successful",
        token: accessToken,
        user: {
          id: user.id,
          profile_photo_url: user.profile_photo_path || "",
          name: user.name,
          email: user.email,
          storeuser_id: 0,
          storeuser: {
            id: 0,
            abn_expires_at: "",
          },
        },
      };

      // Update auth store
      useAuthStore.getState().login(loginData);

        // Save access_token to localStorage
        localStorage.setItem("access_token", accessToken);

      toast.success("Login successful!");
        // Redirect to main site
      router.push("/");
    } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Authentication failed. Please try again.");
      router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileAndLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">
          Completing authentication...
        </h1>
        <p className="text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  );
}
