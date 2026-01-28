"use client";

import { CategoryCard } from "@/components/CategoryCard";
import {  WilayaSearchBar } from "@/components/WilayaSearchBar";
import { SEARCH_CATEGORIES } from "@/lib/constants/search-categories";
import { WilayaByIdType, WILAYA_BY_ID } from "@/lib/constants/wilayas-by-id";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Page() {
  const [selected, setSelected] = useState<WilayaByIdType | null>(null);
  const t = useTranslations("SearchPage");

  return (
    <section className="mx-auto my-6 max-w-4xl space-y-6 p-6">
      <div className="flex w-full flex-col items-center justify-center text-center">
        <h1 className="text-shadow font-semibold uppercase lg:text-4xl">
          {t("H1")}
        </h1>
        <p className="font-normal lg:text-lg">{t("P")}</p>
      </div>

      <WilayaSearchBar
        wilayas={WILAYA_BY_ID}
        selected={selected}
        setSelected={setSelected}
      />
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
        {SEARCH_CATEGORIES.map(
          ({ name, id, icon, searchUrl, bgImage }, index) => (
            <CategoryCard
              key={id}
              name={name}
              icon={icon}
              bgImage={bgImage}
              searchUrl={searchUrl}
              isDesktop={true}
              index={index}
              id={id}
              label={t(`Card.${name}`)}
            />
          ),
        )}
      </div>
    </section>
  );
}
