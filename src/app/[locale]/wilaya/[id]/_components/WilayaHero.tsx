import { Wilaya } from "@/lib/service/wilaya";
import { Localized } from "@/lib/utils/localize-fields";
import Image from "next/image";
import { HeroBadge, HeroActionButtons } from "@/components/hero";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getS3UrlOrDefault } from "@/lib/utils";

export default function WilayaHero({ wilaya }: { wilaya: Localized<Wilaya> }) {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const coverImage = wilaya.pic_cover;

  return (
    <>
      <div className="w-full bg-white pt-8 pb-4 md:pt-12 md:pb-6">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          {/* Header Section */}
          <div className="mb-6">
            {/* Title with Badge and Map */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                  {wilaya.t_name}
                </h1>
                <HeroBadge>Wilaya #{wilaya.matricule}</HeroBadge>
              </div>

              {/* Map Image - Small in header */}
              {wilaya.pic_map && (
                <div className="relative aspect-square h-32 w-32 shrink-0 overflow-hidden rounded-full bg-zinc-700/90 shadow-md">
                  <Image
                    src={wilaya.pic_map}
                    alt={`${wilaya.t_name} map`}
                    fill
                    className="aspect-square object-contain p-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Cover Image - Full width */}
          {coverImage && (
            <div className="mb-6">
              <div
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg"
                onClick={() => {
                  setLightboxIndex(0);
                  setOpenLightbox(true);
                }}
              >
                <div className="aspect-video w-full">
                  <Image
                    src={getS3UrlOrDefault(coverImage)}
                    alt={wilaya.t_name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mb-0 flex flex-wrap gap-4">
            <HeroActionButtons
              mapUrl={wilaya.url_maps}
              latitude={wilaya.latitude}
              longitude={wilaya.longitude}
            />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        slides={[{ src: getS3UrlOrDefault(coverImage) }]}
        index={lightboxIndex}
      />
    </>
  );
}
