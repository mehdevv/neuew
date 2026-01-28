import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaLocationPin, FaVrCardboard } from "react-icons/fa6";
import { isValidUrl } from "@/lib/utils";

interface HeroActionButtonsProps {
  mapUrl?: string | null;
  latitude?: string;
  longitude?: string;
  visit360Url?: string | null;
}

export function HeroActionButtons({
  mapUrl,
  latitude,
  longitude,
  visit360Url,
}: HeroActionButtonsProps) {
  const getMapUrl = () => {
    if (mapUrl) return mapUrl;
    if (latitude && longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }
    return "#";
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {isValidUrl(visit360Url) && (
        <Link href={visit360Url!} target="_blank" rel="noopener noreferrer">
          <Button
            className="group bg-avt-green hover:bg-avt-green/90 hover:shadow-avt-green/50 h-14 gap-3 rounded-lg px-8 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            size="lg"
          >
            <span>Experience in 360°</span>
            <FaVrCardboard className="h-5 w-5 transition-transform group-hover:rotate-12" />
          </Button>
        </Link>
      )}
      <Link href={getMapUrl()} target="_blank" rel="noopener noreferrer">
        <Button
          variant="outline"
          className="group h-14 gap-3 rounded-lg border-2 border-gray-300 bg-white px-8 text-base font-bold text-gray-700 transition-all hover:scale-105 hover:border-avt-green hover:bg-gray-50 hover:text-avt-green"
          size="lg"
        >
          <FaLocationPin className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span>View on Map</span>
        </Button>
      </Link>
    </div>
  );
}

