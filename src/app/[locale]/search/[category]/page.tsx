"use client";

import { useState } from "react";
import { WILAYA_BY_ID } from "@/lib/constants/wilayas-by-id";
import SearchCategoryFilter from "./_components/SearchCategoryFilter";
import FilteredLocations from "./_components/FilteredLocations";
import { useParams } from "next/navigation";
import { SEARCH_CATEGORIES } from "@/lib/constants/search-categories";
import Image from "next/image";

export default function SearchCategoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWilayaId, setSelectedWilayaId] = useState<string>("");

  const params = useParams();
  const currentCategory = params?.category as string;
  const currentCategoryData = SEARCH_CATEGORIES.find(
    (c) => c.searchUrl === "/search/" + currentCategory,
  );

  return (
    <section className="divide-y divide-zinc-300 bg-zinc-100">
      {/* Category Header */}
      <div
        className="relative flex items-center justify-center overflow-hidden bg-cover bg-center py-6 text-white"
        style={{
          backgroundImage: `url(${currentCategoryData?.bgImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative z-10 flex items-center justify-center gap-x-2 text-center">
          <Image
            src={currentCategoryData?.mapImage ?? ""}
            alt={currentCategoryData?.name ?? ""}
            width={128}
            height={128}
            className="aspect-square size-16 md:size-24"
          />
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {currentCategoryData?.name}
          </h1>
        </div>
      </div>
      <div className="mx-auto w-full bg-white p-3 shadow lg:p-6">
        <SearchCategoryFilter
          wilayas={WILAYA_BY_ID}
          selectedWilaya={selectedWilayaId}
          setSelectedWilaya={setSelectedWilayaId}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <FilteredLocations
        categoryId={currentCategoryData?.id ?? NaN}
        selectedWilayaId={parseInt(selectedWilayaId)}
        searchInput={searchTerm}
      />
    </section>
  );
}
