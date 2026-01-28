import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function Hero() {
  const t = useTranslations("landing");
  return (
    <div
      className="relative flex h-[70vh] w-full flex-col items-center justify-end bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(/images/home/hero-cover.jpg)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
      <div className="z-10 container flex w-full flex-col items-center justify-center gap-y-6 bg-clip-padding p-3 text-white lg:p-6">
        <h1 className="mx-auto text-center text-2xl font-bold text-white uppercase md:text-4xl">
          {t("hero.title")}
        </h1>
        <h3 className="mx-auto max-w-xl text-center font-light text-balance text-white md:text-lg">
          {t("hero.subtitle")}
        </h3>
        <div className="flex max-w-md flex-col gap-3 md:max-w-full md:flex-row">
          <Link href="/search">
            <Button className="avt-primary-button w-full">
              {t("hero.exploreButton")}
            </Button>
          </Link>
          <Link href="/travel">
            <Button className="avt-outline-button w-full">
              {t("hero.agencyButton")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
