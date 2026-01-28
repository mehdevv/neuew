import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/lib/service/newsletter";

const NewsletterSchema = z.object({
  email: z.string().email("Email invalide").or(z.literal("")),
});

type NewsletterInput = z.infer<typeof NewsletterSchema>;

function NewsLetterSection() {
  const t = useTranslations("landing.newsletter");

  const locale = useLocale();
  const isRtl = locale === "ar";

  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterInput>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: NewsletterInput) => {
    startTransition(async () => {
      try {
        toast.promise(await subscribeToNewsletter(data.email), {
          loading: "Sending...",
          success: "Subscription successful!",
          error: "Error: Subscription failed!",
        });
        reset();
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="flex w-full justify-center bg-zinc-900">
      <div className="container flex w-full flex-col items-center justify-center gap-y-2 p-3 py-12 text-white lg:p-12">
        <h2 className="mb-4 text-3xl font-bold">{t("title")}</h2>
        <p className="mb-6 text-zinc-400">{t("subtitle")}</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn(
            "flex flex-col items-start gap-4",
            isRtl ? "sm:flex-row-reverse" : "sm:flex-row",
          )}
        >
          <div className="w-full sm:w-auto">
            <Input
              type="email"
              placeholder="email@example.com"
              {...register("email")}
            />
            {errors.email && (
              <div className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="avt-primary-button"
            disabled={pending}
          >
            {t("button")}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default NewsLetterSection;
