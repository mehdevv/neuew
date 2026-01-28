"use client";

import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { initiateTravelerGoogleAuth } from "@/lib/service/store-auth";
import { toast } from "sonner";

type GoogleAuthButtonProps = {
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link";
};

export function GoogleAuthButton({
  className = "w-full",
  variant = "outline",
}: GoogleAuthButtonProps) {
  const handleGoogleAuth = async () => {
    try {
      await initiateTravelerGoogleAuth();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to initiate Google authentication",
      );
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={handleGoogleAuth}
    >
      <FaGoogle className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}
