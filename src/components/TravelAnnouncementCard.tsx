"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  FaArrowRight,
  FaCalendar,
  FaHotel,
  FaList,
  FaLocationPin,
  FaHeart,
  FaComment,
  FaRegMoneyBill1,
} from "react-icons/fa6";
import { AgencyUser, Announcement } from "@/types/announcements";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import {
  getDateDisplayText,
  getDestinationDisplayText,
} from "@/lib/utils/announcement-display";

interface TravelCardProps {
  announcement: Announcement;
  classname?: string;
}

export const TravelAnnouncementCard = memo(function TravelAnnouncementCard({
  announcement,
  classname,
}: TravelCardProps) {
  const t = useTranslations("TravelCard");
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
  const images = announcement?.photos || [];

  // Get formatted date and destination display text
  const dateDisplay = getDateDisplayText(
    announcement?.date_dep,
    announcement?.date_arv,
  );
  const destinationDisplay = getDestinationDisplayText(
    announcement?.destination,
    2,
  );

  // Format price with proper RTL/LTR handling
  const priceFormat = t("price", { price: "{PRICE}" });
  const formattedPrice = announcement?.prix
    ? announcement.prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : "";
  const priceParts = priceFormat.split("{PRICE}");
  const currencyBefore = priceParts[0];
  const currencyAfter = priceParts[1] || "";

  return (
    <Card
      onClick={() =>
        router.push(`/travel/${announcement?.id}`, {
          scroll: true,
        })
      }
      className={cn(
        "group hover:shadow-avt-green/10 h-full w-full cursor-pointer overflow-hidden border border-gray-200 bg-white p-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        classname,
      )}
    >
      <CardContent className="flex h-full w-full flex-col gap-3 p-0">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={`${baseUrl}/${images[0]}`}
              alt={announcement?.titre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </AspectRatio>
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
          <h3 className="group-hover:text-avt-green line-clamp-2 text-lg font-bold text-gray-900 transition-colors md:text-xl">
            {announcement.titre}
          </h3>

          <AgencySection storeuser={announcement?.store} />

          {/* Info Items */}
          <div className="space-y-2.5 text-sm text-gray-600">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="bg-avt-green/10 flex h-6 w-6 items-center justify-center rounded-full">
                  <FaLocationPin className="text-avt-green h-3.5 w-3.5 shrink-0" />
                </div>
                <span className="line-clamp-1 text-sm">
                  {announcement?.lieu_dep}
                </span>
              </div>
              <FaArrowRight className="text-avt-green shrink-0 text-xs" />
              <span className="line-clamp-1 text-sm">
                {destinationDisplay.displayText || "Multiple destinations"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-avt-green/10 flex h-6 w-6 items-center justify-center rounded-full">
                <FaCalendar className="text-avt-green h-3.5 w-3.5 shrink-0" />
              </div>
              <span className="line-clamp-1 text-sm">
                {dateDisplay.displayText || "Multiple dates available"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-avt-green/10 flex h-6 w-6 items-center justify-center rounded-full">
                <FaHotel className="text-avt-green h-3.5 w-3.5" />
              </div>
              <span className="text-sm">{`${t("accommodation")} ${announcement?.hebergement?.name}`}</span>
            </div>
          </div>

          {/* Likes, Comments and price */}
          <div className="flex items-center justify-between border-t pt-2">
            <>
              {(announcement.likes_count !== undefined ||
                announcement.comments_count !== undefined) && (
                <div className="flex items-center gap-4">
                  {announcement.likes_count !== undefined && (
                    <div className="bg-avt-green/10 flex items-center gap-1.5 rounded-full px-2.5 py-1">
                      <FaHeart className="text-avt-green h-4 w-4" />
                      <span
                        className="text-sm font-medium text-gray-700"
                        dir="ltr"
                      >
                        {announcement.likes_count}
                      </span>
                    </div>
                  )}
                  {announcement.comments_count !== undefined && (
                    <div className="bg-avt-green/10 flex items-center gap-1.5 rounded-full px-2.5 py-1">
                      <FaComment className="text-avt-green h-4 w-4" />
                      <span
                        className="text-sm font-medium text-gray-700"
                        dir="ltr"
                      >
                        {announcement.comments_count}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>

            <div className="flex items-center gap-1">
              {announcement.prix && (
                <>
                  <div className="bg-avt-green/20 flex size-8 items-center justify-center rounded-full">
                    <FaRegMoneyBill1 className="text-avt-green h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-avt-green text-lg font-bold md:text-base">
                      {currencyBefore}
                      <bdi
                        dir="ltr"
                        style={{ unicodeBidi: "isolate", display: "inline" }}
                        className="font-extrabold"
                      >
                        {formattedPrice}
                      </bdi>
                      {currencyAfter}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

const AgencySection = ({ storeuser }: { storeuser?: AgencyUser }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!storeuser) return <Skeleton className="h-8 w-2/3 rounded-lg" />;

  return (
    <div className="group-hover:border-avt-green/30 group-hover:bg-avt-green/5 flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50/50 p-2 transition-colors">
      <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
        <AvatarImage src={`${baseUrl}/${storeuser.profile_img}`} />
        <AvatarFallback className="bg-avt-green text-xs text-white">
          {storeuser.pseudo?.charAt(0).toUpperCase() || "AG"}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold text-gray-700">
        {storeuser.pseudo}
      </span>
    </div>
  );
};

export const TravelCardSkeleton = () => {
  return (
    <Card className="h-full w-full p-2">
      <CardContent className="flex h-full flex-col justify-between gap-y-2 px-2 md:px-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="aspect-video w-full rounded-lg" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/4" />
        </div>

        <Skeleton className="h-6 w-1/3" />

        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
};
