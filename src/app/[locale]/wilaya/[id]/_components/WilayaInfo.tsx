import { cn } from "@/lib/utils";
import { useState } from "react";

export function WilayaInfo({ text }: { text: string }) {
  const [readMore, setReadMore] = useState(false);
  return (
    <div className="max-w-4xl">
      <p
        className={cn(
          " rounded-lg p-2 border-2 border-white/20 bg-black/30 text-justify text-base font-medium text-balance backdrop-blur-md transition-all md:text-lg lg:text-xl",
          !readMore && "line-clamp-[10] md:line-clamp-5",
        )}
        dangerouslySetInnerHTML={{
          __html: text.replaceAll(/\\r\\n/g, "<br><br>"),
        }}
        dir="auto"
      />
      <span
        className="hover:text-avt-green mt-2 inline-block cursor-pointer text-sm underline"
        onClick={() => setReadMore(!readMore)}
      >
        {readMore ? "Read less" : "Read more"}
      </span>
    </div>
  );
}
