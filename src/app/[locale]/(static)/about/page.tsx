"use client";

import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("AboutUsPage");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const services = t.raw("services") as string[];
  return (
    <section
      className={cn("mx-auto max-w-4xl px-4 py-8 text-center", isRtl && "rtl")}
    >
      <h2 className="mb-4 text-3xl font-bold">{t("title")}</h2>

      <p className="mb-6">{t("intro")}</p>

      <h3 className="mb-2 text-2xl font-semibold">{t("visionTitle")}</h3>
      <p className="mb-6">{t("vision")}</p>

      <h3 className="mb-2 text-2xl font-semibold">{t("servicesTitle")}</h3>

      <ul className="mb-6 space-y-2">
        {services.map((service, idx) => (
          <li key={idx}>{service}</li>
        ))}
      </ul>

      <h3 className="mb-2 text-2xl font-semibold">{t("whyTitle")}</h3>
      <p className="mb-6">{t("why")}</p>

      <p className="font-medium">{t("closing")}</p>
    </section>
  );
}
