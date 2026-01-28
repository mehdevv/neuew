"use client";

import {
  TravelAnnouncementCard,
  TravelCardSkeleton,
} from "@/components/TravelAnnouncementCard";
import { Button } from "@/components/ui/button";
import { useAnnouncements } from "@/hooks/useAnnouncement";
import { useLocale, useMessages, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { FaCheck } from "react-icons/fa6";

export function Section3() {
  const t = useTranslations("landing");
  const messages = useMessages();
  const benefits = messages.landing.organizedTrips.agencyBenefits as string[];

  const { data: announcements, isLoading, error } = useAnnouncements();
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className="flex w-full justify-center bg-zinc-900">
      <div className="container flex w-full flex-col items-center justify-center gap-y-6 p-3 py-12 text-white lg:p-12">
        <h2 className="text-center text-2xl font-bold uppercase md:text-4xl">
          {t("organizedTrips.title")}
        </h2>
        <h3 className="text-lg font-light">{t("organizedTrips.subtitle")}</h3>

        <Link href="/travel">
          <Button className="avt-primary-button">
            {t("organizedTrips.findOffersButton")}
          </Button>
        </Link>
        <h3 className="text-center text-xl font-bold md:text-2xl">
          {t("organizedTrips.recentPosts")}
        </h3>

        <div className="w-full">

          {isLoading && (
            <div className="grid w-full grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <TravelCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="py-10 text-center">
              <p className="text-zinc-600">{t("no_results_found")}</p>
            </div>
          )}

          {announcements && (
            <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {announcements.slice(0, 8).map((announcement) => (
                <TravelAnnouncementCard
                  key={"announcement-" + announcement.id}
                  announcement={announcement}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className={`flex w-full flex-col gap-y-3 rounded-lg bg-zinc-800 p-3 lg:p-12 ${isRtl && "items-end"}`}
        >
          <h2
            className={`text-start text-2xl font-bold text-balance uppercase md:text-4xl ${isRtl && "text-end"} `}
          >
            {t("organizedTrips.forAgenciesTitle")}
          </h2>
          <div
            className={`flex flex-col items-center justify-between gap-6 lg:flex-row lg:divide-x lg:divide-zinc-700 ${isRtl && "lg:flex-row-reverse"}`}
          >
            <div className="flex flex-col justify-start gap-y-3 p-3">
              <h3
                className={`text-justify text-lg font-bold ${isRtl && "text-end"}`}
              >
                {t("organizedTrips.forAgenciesSubtitle1")} {": "}
                <span className="text-start text-lg font-light">
                  {t("organizedTrips.forAgenciesSubtitle2")}
                </span>
              </h3>
              {benefits.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-row items-start justify-start gap-x-2 ${isRtl && "flex-row-reverse"}`}
                >
                  <FaCheck /> {item}
                </div>
              ))}
            </div>
            <Image
              src="/images/home/store-icon-white.png"
              alt="store-logo"
              className="hidden h-48 w-auto lg:flex"
              width={200}
              height={100}
            />
          </div>
          <Link href="/create-store">
            <Button className="avt-primary-button">
              {t("organizedTrips.registerButton")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
