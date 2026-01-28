import { ReactNode, useEffect, useState } from "react";
import { cn, getS3UrlOrDefault, isValidUrl } from "@/lib/utils";

interface HeroSectionProps {
  coverImage: string;
  minHeight?: string;
  children: ReactNode;
}

export function HeroSection({
  coverImage,
  minHeight = "min-h-[95vh]",
  children,
}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle both local images (starting with /) and S3 URLs
  const getImageUrl = (image: string) => {
    if (image.startsWith("/") || isValidUrl(image)) {
      return image;
    }
    return getS3UrlOrDefault(image);
  };

  return (
    <section
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat text-white",
        minHeight,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,194,42,0.15) 50%, rgba(0,0,0,0.85) 100%), url(${getImageUrl(coverImage)})`,
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />

      {/* Main content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 md:px-8 lg:px-12">
        <div
          className={cn(
            "flex flex-col items-center justify-center space-y-8 transition-all duration-1000",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0",
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

