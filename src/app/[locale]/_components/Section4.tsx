"use client";

import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export function Section4() {
  const t = useTranslations("landing.mapSection");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className="container flex w-full flex-col items-center justify-center gap-y-6 p-3 py-12 lg:p-12">
      <div
        className={`flex gap-6 md:flex-row ${isRtl && "md:flex-row-reverse"}`}
      >
        <div
          className={`flex w-full flex-col items-start justify-center gap-6 ${isRtl && "items-end"}`}
        >
          <h3
            className={`text-start text-2xl font-bold uppercase md:text-4xl ${isRtl && "text-end"}`}
          >
            {t("title")}
          </h3>
          <h2 className="text-lg font-light text-balance md:text-xl">
            {t("subtitle")}
          </h2>
          <Link href="/map">
            <Button className="avt-primary-button">{t("goToMapButton")}</Button>
          </Link>
        </div>
        <Image
          className="hidden h-96 w-auto md:flex"
          src="/images/home/dz-map-2.jpg"
          alt="dzMap2"
          width={200}
          height={100}
        />
      </div>
    </div>
  );
}
