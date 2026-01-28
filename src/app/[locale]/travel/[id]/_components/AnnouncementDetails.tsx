"use client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Announcement } from "@/types/announcements";
import {
  FaCalendar,
  FaChevronDown,
  FaChevronUp,
  FaCircleInfo,
  FaCircleUser,
  FaClock,
  FaFile,
  FaHouse,
  FaHotel,
  FaList,
  FaLocationPin,
  FaShare,
} from "react-icons/fa6";
import {
  formatDateDisplay,
  getClosestUpcomingDate,
} from "@/lib/utils/announcement-display";
import { TravelHeader } from "./TravelHeader";
import { InfoItem } from "./InfoItem";
import { ContactCard } from "./ContactItem";
import { TravelAnnouncementCard } from "@/components/TravelAnnouncementCard";
import { AnnouncementInteractions } from "./AnnouncementInteractions";
import { RatingComponent } from "./RatingComponent";
import { LikeButtonSection } from "./LikeButtonSection";
import { ShareDrawer } from "./ShareDrawer";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useAuthStore } from "@/store/auth";

type Props = {
  announcement: Announcement;
  related: Announcement[];
};

export default function AnnouncementDetails({ announcement, related }: Props) {
  const { user } = useAuthStore();
  const parsedPhotos = announcement.photos || [];

  const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  const [openLightBox, setOpenLightBox] = useState(false);
  // track which image was clicked
  const [lightBoxIndex, setLightBoxIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Calculate average rating from interactions
  const calculateAverageRating = () => {
    if (!announcement.interactions || announcement.interactions.length === 0) {
      return { rating: 0, count: 0 };
    }
    const ratingsWithValues = announcement.interactions.filter(
      (i) => i.rating !== null && i.rating !== undefined,
    );
    if (ratingsWithValues.length === 0) {
      return { rating: 0, count: 0 };
    }
    const sum = ratingsWithValues.reduce((acc, i) => acc + (i.rating || 0), 0);
    return {
      rating: sum / ratingsWithValues.length,
      count: ratingsWithValues.length,
    };
  };

  const { rating: avgRating, count: ratingCount } = calculateAverageRating();

  // Rating handler - uses new API
  const handleRate = async (rating: number) => {
    try {
      const { addRating } = await import("@/lib/service/announcements");
      // Get current like and bookmark states from interactions
      const userInteraction = announcement.interactions?.find(
        (i) => i.voyageur_id === user?.id,
      );
      const currentLiked = userInteraction?.liked === 1 || false;
      const currentBookmarked = userInteraction?.bookmarked === 1 || false;

      await addRating(
        announcement.id,
        Math.round(rating), // Round to integer (1-5)
        currentLiked,
        currentBookmarked,
      );
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error; // Re-throw to let RatingComponent handle the error
    }
  };

  return (
    <main className="mx-auto max-w-6xl bg-white px-4 py-8 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-white p-6 shadow-sm md:p-8">
        <TravelHeader
          category={`${announcement.category?.name} ${announcement.subcategory?.name}`}
          title={announcement.titre}
          price={
            announcement.prix
              ? announcement.prix
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              : ""
          }
        />
      </div>

      <Lightbox
        open={openLightBox}
        close={() => setOpenLightBox(false)}
        slides={parsedPhotos.map((photo) => ({
          src: `${baseUrl}/${photo}`,
        }))}
        index={lightBoxIndex} // show clicked image
      />

      {/* Image Gallery */}
      {parsedPhotos.length > 0 ? (
        <div className="mb-8 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {parsedPhotos.slice(0, 3).map((photo, index) => {
            const isLastVisible = index === 2 && parsedPhotos.length > 3;
            const remainingCount = parsedPhotos.length - 3;

            return (
              <div
                key={photo}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <Image
                  src={`${baseUrl}/${photo}`}
                  alt={`upload ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onClick={() => {
                    setLightBoxIndex(index);
                    setOpenLightBox(true);
                  }}
                  width={400}
                  height={300}
                />
                {isLastVisible && (
                  <div
                    className="group absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all hover:bg-black/10 hover:backdrop-blur-none"
                    onClick={() => {
                      setLightBoxIndex(0);
                      setOpenLightBox(true);
                    }}
                  >
                    <div className="rounded-full bg-white/95 px-4 py-2 text-lg font-semibold text-gray-900 shadow-lg backdrop-blur-sm transition-transform group-hover:scale-125">
                      +{remainingCount} more
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-8 flex h-64 w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
          <p className="text-gray-500">No images available</p>
        </div>
      )}

      {/* Travel Details Section */}
      <section className="mb-8">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
          <div className="bg-avt-green/10 flex h-10 w-10 items-center justify-center rounded-full">
            <FaCircleInfo className="text-avt-green h-5 w-5" />
          </div>
          Travel Details
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Category */}

          {/* Published */}
          <div className="group hover:border-avt-green/30 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-avt-green/10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                <FaCalendar className="text-avt-green h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Published</p>
                <p className="font-medium">
                  {announcement.created_at.split("T")[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Departure */}
          <div className="group hover:border-avt-green/30 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-avt-green/10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                <FaLocationPin className="text-avt-green h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Departure</p>
                <p className="font-medium">
                  {announcement.lieu_dep}, {announcement.wilaya_dep}
                </p>
              </div>
            </div>
          </div>

          {/* Accommodation */}
          <div className="group hover:border-avt-green/30 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-avt-green/10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                <FaHotel className="text-avt-green h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Accommodation</p>
                <p className="font-medium">
                  {announcement?.hebergement?.name || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Travel Periods - spans 2 columns on large screens */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-avt-green/10 flex h-8 w-8 items-center justify-center rounded-full">
                <FaClock className="text-avt-green h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Travel Periods
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const depArray = Array.isArray(announcement.date_dep)
                  ? announcement.date_dep
                  : [announcement.date_dep].filter(Boolean);
                const arvArray = Array.isArray(announcement.date_arv)
                  ? announcement.date_arv
                  : [announcement.date_arv].filter(Boolean);
                const maxLength = Math.max(depArray.length, arvArray.length);

                if (maxLength === 0) {
                  return (
                    <p className="text-sm text-gray-500">No dates available</p>
                  );
                }

                const { index: closestIndex } =
                  getClosestUpcomingDate(depArray);

                return Array.from({ length: maxLength }).map((_, index) => {
                  const dep = depArray[index] || "";
                  const arv = arvArray[index] || "";
                  const isUpcoming = index === closestIndex;

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                        isUpcoming
                          ? "border-avt-green bg-avt-green/5"
                          : "border-zinc-200 bg-zinc-50"
                      }`}
                    >
                      <FaCalendar
                        className={`shrink-0 ${
                          isUpcoming ? "text-avt-green" : "text-zinc-400"
                        }`}
                      />
                      <span className="font-medium">
                        {formatDateDisplay(dep)} - {formatDateDisplay(arv)}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Destinations - spans 1 column on large screens */}
          <div className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-avt-green/10 flex h-8 w-8 items-center justify-center rounded-full">
                <FaLocationPin className="text-avt-green h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Destinations
              </p>
            </div>
            <div className="flex h-fit flex-wrap gap-2">
              {(() => {
                const destArray = Array.isArray(announcement.destination)
                  ? announcement.destination
                  : [announcement.destination].filter(Boolean);

                if (destArray.length === 0) {
                  return (
                    <p className="text-sm text-gray-500">
                      No destinations specified
                    </p>
                  );
                }

                return destArray.map((dest, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-avt-green/30 bg-avt-green/5 hover:bg-avt-green/10 w-fit px-3 py-1 text-sm font-normal text-zinc-700"
                  >
                    {dest}
                  </Badge>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-avt-green/10 flex h-8 w-8 items-center justify-center rounded-full">
              <FaFile className="text-avt-green h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Description</p>
          </div>
          <div className="relative">
            <div
              className={`prose prose-gray max-w-none text-gray-700 transition-all ${
                !isDescriptionExpanded ? "line-clamp-10" : ""
              }`}
              dangerouslySetInnerHTML={{ __html: announcement?.description }}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="group bg-avt-green/10 text-avt-green hover:bg-avt-green/20 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all"
              >
                {isDescriptionExpanded ? (
                  <>
                    <span>Show Less</span>
                    <FaChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  </>
                ) : (
                  <>
                    <span>Show More</span>
                    <FaChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rating, Like, and Share Section */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Like Section */}
          <div className="flex items-center gap-4">
            <LikeButtonSection announcement={announcement} />
          </div>

          {/* Rating and Share Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end sm:gap-6">
            {/* Rating */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Rating
                </span>
              </div>
              <RatingComponent
                rating={avgRating}
                count={ratingCount}
                onRate={handleRate}
              />
            </div>

            {/* Share */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Share</span>
              </div>
              <ShareDrawer url="" title={announcement.titre} />
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <AnnouncementInteractions announcement={announcement} />
      </section>

      {/* Contact Information Section */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-900">
          <div className="bg-avt-green/10 flex h-10 w-10 items-center justify-center rounded-full">
            <FaCircleUser className="text-avt-green h-5 w-5" />
          </div>
          Contact Information
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <ContactCard storeuser={announcement.store} />
        </div>
      </section>

      {/* Related Offers Section */}
      {related?.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Related Offers
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((announcement) => (
              <TravelAnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
