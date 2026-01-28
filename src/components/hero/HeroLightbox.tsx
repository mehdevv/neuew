import { ReactNode, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getS3UrlOrDefault } from "@/lib/utils";

interface HeroLightboxProps {
  coverImage: string;
  children: (open: () => void) => ReactNode;
}

export function HeroLightbox({ coverImage, children }: HeroLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {children(() => setOpen(true))}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: getS3UrlOrDefault(coverImage) }]}
      />
    </>
  );
}

