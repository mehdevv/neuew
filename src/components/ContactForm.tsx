"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import z from "zod";
import { axiosInstance } from "@/lib/utils/axios-instant";
import { apiCall } from "@/lib/utils/error-handler";

const ContactSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Email is invalid"),
  phone: z.string().min(10, "Phone number is required"),
  message: z.string().min(10, "Message is required"),
});

type ContactFormData = z.infer<typeof ContactSchema>;

export const ContactForm = () => {
  const t = useTranslations("Contact_us_page");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      email: "",
      phone: "",
      message: "",
      name: "",
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: ContactFormData) => {
    await apiCall(
      () => axiosInstance.post("/api/mailing/contact-us/send", values),
      {
        onError: "toast",
        errorMessage: "Failed to send message",
      },
    );
      toast.success("Message sent successfully");
    reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6 rounded-lg p-3 md:p-6"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="gap-1">
                  {`${t("Last_Name")}, ${t("First_Name")}`}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={`${t("Last_Name")}, ${t("First_Name")}`}
                    {...field}
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
              <FormItem className="w-full">
                <FormLabel className="gap-1">
                  {t("Email")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t("Email")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="gap-1">
                  {t("Phone_Number")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={t("Phone_Number")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                {t("Your_Message")}
                <span className="m-0 p-0 text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea placeholder={t("Your_Message")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-avt-green hover:bg-avt-green/90 text-white"
        >
          {t("Send")}
        </Button>
      </form>
    </Form>
  );
};
