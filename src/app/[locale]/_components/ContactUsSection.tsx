import { ContactForm } from "@/components/ContactForm";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

const ContactUsSection = () => {
  const t = useTranslations("landing.contact");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className="container flex w-full flex-col items-center justify-center gap-y-6 p-3 py-12 lg:p-12">
      <div
        className={`flex w-full flex-col items-start justify-center gap-6 ${isRtl && "items-end"}`}
      >
        <h2 className="text-start text-2xl font-bold uppercase md:text-4xl">
          {t("title")}
        </h2>
        <h3 className="text-lg font-light text-balance md:text-xl">
          {t("subtitle")}
        </h3>
      </div>
      <div className="w-full rounded-lg bg-zinc-50 text-zinc-900 lg:p-6">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactUsSection;
