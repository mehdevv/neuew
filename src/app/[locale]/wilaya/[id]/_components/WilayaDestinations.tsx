import { LocationCard } from "@/app/[locale]/search/[category]/_components/LocationCard";
import { SEARCH_CATEGORIES } from "@/lib/constants/search-categories";
import { Location } from "@/lib/service/locations";
import { useState } from "react";
import { DestinationsFilter } from "./DestinationFilter";
import { useLocale } from "next-intl";
import { withResolvedLocale } from "@/lib/utils/localize-fields";

export function WilayaDestinations({ locations }: { locations: Location[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const locale = useLocale() as "en" | "fr" | "ar";
  const filteredLocations = filterLocationsByCategory(
    locations,
    selectedCategory,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Filter section */}
      <div className="flex flex-wrap gap-3">
        <DestinationsFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        {selectedCategory && (
          <div className="bg-avt-green/10 flex items-center gap-2 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-gray-700">
              {filteredLocations.length} location
              {filteredLocations.length !== 1 ? "s" : ""} found
            </span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="w-full">
        {filteredLocations.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-600">
              No locations found for the selected category.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try selecting a different category or view all locations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((location) => {
              const categoryId = SEARCH_CATEGORIES.find(
                (c) => c.id.toString() === location.type,
              )?.id;

              const localizedLocation = withResolvedLocale(location, locale);

              return (
                <LocationCard
                  key={location.id}
                  categoryId={categoryId}
                  location={localizedLocation}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const filterLocationsByCategory = (
  locations: Location[],
  categoryName: string | null,
) => {
  if (!categoryName) return locations;

  return locations.filter((location) => {
    return location.type === categoryName;
  });
};
