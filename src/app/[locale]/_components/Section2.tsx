"use client";
import { WilayaSearchBar } from "@/components/WilayaSearchBar";
import useWindowSize from "@/hooks/useWindowSize";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { WILAYA_BY_ID, WilayaByIdType } from "@/lib/constants/wilayas-by-id";
import { SEARCH_CATEGORIES } from "@/lib/constants/search-categories";
import { CategoryCard } from "@/components/CategoryCard";

export function Section2() {
  const tl = useTranslations("landing");
  const ts = useTranslations("SearchPage");
  const { isDesktop } = useWindowSize();
  const [selected, setSelected] = useState<WilayaByIdType | null>(null);

  return (
    <div className="container flex w-full flex-col items-center justify-center gap-y-6 p-3 py-12 lg:p-12">
      <h2 className="mx-auto text-center text-2xl font-bold uppercase md:text-4xl">
        {tl("explorer360.title")}
      </h2>

      <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
        <div className="flex w-full flex-col gap-6">
          <h3 className="text-center text-lg font-light text-balance md:text-xl">
            {tl("explorer360.subtitle")}
          </h3>
          <div className="w-full">
            <WilayaSearchBar
              wilayas={WILAYA_BY_ID}
              selected={selected}
              setSelected={setSelected}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
            {SEARCH_CATEGORIES.map(
              ({ name, id, icon, searchUrl, bgImage }, index) => (
                <CategoryCard
                  key={id}
                  name={name}
                  icon={icon}
                  bgImage={bgImage}
                  searchUrl={searchUrl}
                  isDesktop={isDesktop}
                  index={index}
                  id={id}
                  label={ts(`Card.${name}`)}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
