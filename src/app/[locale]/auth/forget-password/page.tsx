"use client";

import { ForgetPasswordForm } from "../_components/ForgetPasswordForm";
import Link from "next/link";

export default function ForgetPasswordPage() {
  return (
    <div className="mx-auto max-w-lg py-10">
      <h1 className="mb-6 text-center text-3xl font-bold">Forgot Password</h1>

      <ForgetPasswordForm />

      <div className="mt-6 text-center text-sm">
        Remember your password?{" "}
        <Link className="text-avt-green font-bold underline" href="/auth/login">
          Log In
        </Link>
      </div>
    </div>
  );
}

