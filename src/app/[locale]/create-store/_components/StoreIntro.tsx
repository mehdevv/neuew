"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export default function StoreIntro() {
  const t = useTranslations("Introcon");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="flex flex-col items-center">
      {/* Image */}
      <Image
        src="/images/store.png"
        alt="Store"
        width={250}
        height={250}
        className="mt-8 md:mt-12"
      />

      {/* Main Card */}
      <div className="bg-avt-green mt-8 w-full max-w-4xl rounded-2xl px-6 py-8 text-white shadow-lg">
        <h2 className="mb-4 text-2xl font-bold md:text-3xl">{t("title")}</h2>
        <p className="text-base leading-relaxed md:text-lg">
          {t("description")}
        </p>

        {/* Why Choose Us */}
        <div className="mt-8">
          <h3 className="mb-2 text-xl font-bold md:text-2xl">
            {t("why_choose.title")}
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold">
                {t("why_choose.visibility.title")}
              </h4>
              <p className="text-sm md:text-base">
                {t("why_choose.visibility.description")}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">
                {t("why_choose.boost_sales.title")}
              </h4>
              <p className="text-sm md:text-base">
                {t("why_choose.boost_sales.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Benefits */}
        <div className="mt-8">
          <h3 className="mb-2 text-xl font-bold md:text-2xl">
            {t("subscription_benefits.title")}
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold">
                {t("subscription_benefits.market_access.title")}
              </h4>
              <p className="text-sm md:text-base">
                {t("subscription_benefits.market_access.description")}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">
                {t("subscription_benefits.ready_solution.title")}
              </h4>
              <p className="text-sm md:text-base">
                {t("subscription_benefits.ready_solution.description")}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">
                {t("subscription_benefits.network_success.title")}
              </h4>
              <p className="text-sm md:text-base">
                {t("subscription_benefits.network_success.description")}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            className="avt-outline-button block rounded-lg p-2"
            href="/files/offer-avt.pdf"
            download="offer-avt.pdf"
          >
            {t("cta")}
          </a>

          <p className="mt-4 text-sm">{t("footer")}</p>
        </div>
      </div>
    </section>
  );
}
