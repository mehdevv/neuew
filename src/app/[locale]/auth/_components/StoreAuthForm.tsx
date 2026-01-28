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
import { storeLogin } from "@/lib/service/store-auth";
import { useAuthStore } from "@/store/auth";
import { redirect } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const baseSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signupSchema = baseSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type LogInData = z.infer<typeof baseSchema>;
type SignUpData = z.infer<typeof signupSchema>;

type AuthFormProps = {
  mode: "login" | "signup";
  userType: "agency" | "traveler";
};

// TODO: add logic for usertype
export function AuthStoreForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const form = useForm<SignUpData | LogInData>({
    resolver: zodResolver(mode === "login" ? baseSchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitLogIn = async (data: LogInData) => {
    setIsSubmitting(true);
    try {
    const { email, password } = data;
    const userData = await storeLogin(email, password);
    useAuthStore.getState().login(userData);
      toast.success("Login successful!");
      router.push("/store");
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

  // const onSubmitSignUp = (data: SignUpData) => {
  // if (mode === "signup") {
  //   const { email, password, confirmPassword } = data;
  //   storeSignup(email, password, confirmPassword);
  // }
  // };

  const onSubmit = (data: SignUpData | LogInData) => {
    if (mode === "login") {
      onSubmitLogIn(data);
    }
    // else if (mode === "signup") {
    // onSubmitSignUp(data as SignUpData);
    // }
  };
  const [showPassword, setShowPassword] = useState(false);

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

          {mode === "signup" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="accent-avt-green"
                      placeholder="••••••••••"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="avt-primary-button w-full"
            disabled={isSubmitting}
          >
            {mode === "login"
              ? isSubmitting
                ? "Logging in..."
                : "Log In"
              : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
