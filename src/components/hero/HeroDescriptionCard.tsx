import { useState } from "react";
import { cn } from "@/lib/utils";
import { FaChevronDown } from "react-icons/fa6";

interface HeroDescriptionCardProps {
  description: string;
  maxWidth?: string;
  className?: string;
}

export function HeroDescriptionCard({
  description,
  maxWidth = "max-w-4xl",
  className = "",
}: HeroDescriptionCardProps) {
  const [readMore, setReadMore] = useState(false);

  if (!description) return null;

  return (
    <div className={cn("w-full", maxWidth, className)}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-black/40 via-black/50 to-black/40 p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 md:p-8 lg:p-10",
          "hover:border-white/30 hover:shadow-[0_0_30px_rgba(0,194,42,0.2)]",
        )}
      >
        {/* Decorative gradient accent */}
        <div className="via-avt-green absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent to-transparent opacity-50" />

        <div
          className={cn(
            "prose prose-invert prose-lg max-w-none text-justify text-white/90 transition-all duration-500",
            !readMore && "line-clamp-[8] md:line-clamp-6",
          )}
          dangerouslySetInnerHTML={{
            __html: description.replaceAll(/\\r\\n/g, "<br><br>"),
          }}
          dir="auto"
        />

        {/* Read more button */}
        <button
          onClick={() => setReadMore(!readMore)}
          className="group text-avt-green hover:text-avt-green/80 mt-4 flex items-center gap-2 text-sm font-semibold transition-all hover:underline"
        >
          <span>{readMore ? "Read less" : "Read more"}</span>
          <FaChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              readMore && "rotate-180",
            )}
          />
        </button>
      </div>
    </div>
  );
}

