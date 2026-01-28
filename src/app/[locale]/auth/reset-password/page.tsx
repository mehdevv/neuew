"use client";

import { ResetPasswordForm } from "../_components/ResetPasswordForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");
    if (!tokenParam) {
      toast.error("Invalid reset link. Please request a new password reset.");
      setToken(null);
      setEmail(null);
    } else {
      setToken(tokenParam);
      setEmail(emailParam);
    }
    setIsChecking(false);
  }, [searchParams]);

  if (isChecking) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <div className="space-y-4 text-center">
          <div className="border-avt-green mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <div className="mx-auto max-w-sm rounded-xl border-none border-zinc-800 p-6 shadow-none lg:border-2 lg:shadow-sm">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">Invalid Reset Link</h2>
            <p className="text-sm text-gray-600">
              The password reset link is invalid or has expired. Please request
              a new password reset.
            </p>
            <Link href="/auth/forget-password">
              <Button className="avt-primary-button w-full">
                Request New Reset Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-10">
      <h1 className="mb-6 text-center text-3xl font-bold">Reset Password</h1>

      <ResetPasswordForm token={token} email={email} />

      <div className="mt-6 text-center text-sm">
        Remember your password?{" "}
        <Link className="text-avt-green font-bold underline" href="/auth/login">
          Log In
        </Link>
      </div>
    </div>
  );
}
