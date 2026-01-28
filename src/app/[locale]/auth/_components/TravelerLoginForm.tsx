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
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { useState } from "react";
import { travelerLogin } from "@/lib/service/store-auth";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const travelerLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type TravelerLoginData = z.infer<typeof travelerLoginSchema>;

export function TravelerLoginForm() {
  const router = useRouter();
  const form = useForm<TravelerLoginData>({
    resolver: zodResolver(travelerLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: TravelerLoginData) => {
    setIsSubmitting(true);
    try {
      const { email, password } = data;
      const userData = await travelerLogin(email, password);
      useAuthStore.getState().login({
        message: userData.message,
        token: userData.token,
        user: {
          id: userData.user.id,
          storeuser_id: 0, // Travelers don't have storeuser_id
          profile_photo_url: userData.user.profile_photo_path || "",
          storeuser: {
            id: 0,
            abn_expires_at: "",
          },
        },
      });
      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      // Error message is already handled by the service function
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while logging in.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto my-3 max-w-sm rounded-xl border-none border-zinc-800 p-6 shadow-none lg:border-2 lg:shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    className="accent-avt-green"
                    placeholder="example@gmail.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
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
              );
            }}
          />

          <div className="flex justify-end">
            <Link
              href="/auth/forget-password"
              className="text-sm text-avt-green hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="avt-primary-button w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="text-muted-foreground bg-white px-2">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleAuthButton />
        </form>
      </Form>
    </div>
  );
}
