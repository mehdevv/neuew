import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaLocationPin } from "react-icons/fa6";
import { FaExpand } from "react-icons/fa";

interface HeroFloatingActionsProps {
  onExpandClick: () => void;
  mapUrl?: string | null;
  latitude?: string;
  longitude?: string;
}

export function HeroFloatingActions({
  onExpandClick,
  mapUrl,
  latitude,
  longitude,
}: HeroFloatingActionsProps) {
  const getMapUrl = () => {
    if (mapUrl) return mapUrl;
    if (latitude && longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }
    return "#";
  };

  return (
    <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
      <Button
        variant="secondary"
        size="icon"
        className="group h-12 w-12 rounded-full bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 hover:shadow-lg"
        onClick={onExpandClick}
        aria-label="View cover image"
      >
        <FaExpand className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
      </Button>
      <Link href={getMapUrl()} target="_blank" rel="noopener noreferrer">
        <Button
          variant="secondary"
          size="icon"
          className="group h-12 w-12 rounded-full bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 hover:shadow-lg"
          aria-label="Find on maps"
        >
          <FaLocationPin className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
        </Button>
      </Link>
    </div>
  );
}

