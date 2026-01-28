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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { useState } from "react";
import { travelerSignup } from "@/lib/service/store-auth";
import { toast } from "sonner";

const travelerSignupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Please enter a valid phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type TravelerSignupData = z.infer<typeof travelerSignupSchema>;

export function TravelerSignupForm() {
  const form = useForm<TravelerSignupData>({
    resolver: zodResolver(travelerSignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const onSubmit = async (data: TravelerSignupData) => {
    try {
      const { name, email, password, confirmPassword, phone } = data;
      const response = await travelerSignup(
        name,
        email,
        password,
        confirmPassword,
        phone,
      );
      // Show dialog with verification message
      setVerificationMessage(
        (response as any).message ||
          "Please check your email for verification instructions.",
      );
      setShowVerificationDialog(true);
      form.reset();
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while signing up.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Dialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Verification Required</DialogTitle>
            <DialogDescription className="pt-2">
              {verificationMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowVerificationDialog(false)}
              className="avt-primary-button"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    <div className="mx-auto my-3 max-w-sm rounded-xl border-none border-zinc-800 p-6 shadow-none lg:border-2 lg:shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="accent-avt-green"
                    placeholder="John Doe"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    {...field}
                    className="accent-avt-green"
                    placeholder="+213 555 123 456"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => {
              return (
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
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
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
              );
            }}
          />

          <Button type="submit" className="avt-primary-button w-full">
            Sign Up
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
    </>
  );
}
