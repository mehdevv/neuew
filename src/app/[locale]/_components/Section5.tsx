"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export function Section5() {
  const t = useTranslations("landing.ctaSection");

  return (
    <div className="relative flex h-[75vh] w-full items-end justify-center overflow-hidden bg-zinc-900 p-3 lg:p-6">
      <Image
        src="/images/home/cta-cover.jpeg"
        alt="Background"
        fill
        className="object-cover object-center"
        priority
      />

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-900 to-transparent" />

      <div className="z-20 container flex w-full flex-col items-center justify-end gap-y-6 text-white lg:p-6">
        <h2 className="text-center text-2xl font-bold uppercase md:text-4xl">
          {t("title")}
        </h2>
        <h3 className="text-center text-lg font-light">{t("subtitle")}</h3>

        <Link href="/travel">
          <Button className="avt-primary-button">{t("button")}</Button>
        </Link>
      </div>
    </div>
  );
}
