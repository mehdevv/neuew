"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { resetPassword } from "@/lib/service/store-auth";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

type ResetPasswordFormProps = {
  token: string;
  email: string;
};

export function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    setIsSubmitting(true);
    try {
      // Only travelers can reset password
      await resetPassword(
        token,
        email,
        data.password,
        data.password_confirmation,
        "voyageurs",
      );
      toast.success("Password reset successfully! You can now log in.");
      router.push("/auth/login?tab=traveler");
    } catch (error) {
      console.error("Password reset error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while resetting password.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto my-3 max-w-sm rounded-xl border-none border-zinc-800 p-6 shadow-none lg:border-2 lg:shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4 text-sm text-gray-600">
            Enter your new password to reset your password for{" "}
            <span className="font-semibold">{email}</span>.
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="accent-avt-green pr-10"
                      placeholder="••••••••••"
                    />
                    <Button
                      type="button"
                      variant="link"
                      size="icon"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-0 right-0 h-full px-3 text-zinc-500 hover:text-zinc-800"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-4 w-4" />
                      ) : (
                        <FaEye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      className="accent-avt-green pr-10"
                      placeholder="••••••••••"
                    />
                    <Button
                      type="button"
                      variant="link"
                      size="icon"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute top-0 right-0 h-full px-3 text-zinc-500 hover:text-zinc-800"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-4 w-4" />
                      ) : (
                        <FaEye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="avt-primary-button w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
