import { useLocationsByCategory } from "@/hooks/useLocations";
import { LocationCard, LocationCardSkeleton } from "./LocationCard";
import { Localized, withResolvedLocale } from "@/lib/utils/localize-fields";
import { Location } from "@/lib/service/locations";
import { useLocale } from "next-intl";

type Props = {
  categoryId: number;
  selectedWilayaId: number;
  searchInput: string;
};

export default function FilteredLocations({
  categoryId,
  selectedWilayaId,
  searchInput,
}: Props) {
  const locale = useLocale() as "en" | "fr" | "ar";
  const {
    data: locations = [],
    isLoading,
    isError,
  } = useLocationsByCategory(categoryId);

  const filtered = locations.filter((loc) => {
    const search = searchInput?.trim().toLowerCase();
    const hasSearch = !!search;
    const hasWilaya = !!selectedWilayaId;

    const matchesWilaya = hasWilaya
      ? String(loc.wilaya_id) === String(selectedWilayaId)
      : true;

    const matchesSearch = hasSearch
      ? loc.name_fr?.toLowerCase().includes(search) ||
        loc.name_ar?.toLowerCase().includes(search)
      : true;

    return matchesWilaya && matchesSearch;
  });

  if (isError) return <p>Error loading locations</p>;

  return (
    <div className="mx-auto max-w-5xl columns-1 space-y-4 p-4 sm:columns-2 lg:columns-3">
      {/* skeleton while loading */}
      {isLoading &&
        [...Array(6)].map((_, i) => (
          <div key={i} className="break-inside-avoid">
            <LocationCardSkeleton />
          </div>
        ))}

      {filtered.map((location) => {
        const localizedLocation = withResolvedLocale(
          location,
          locale,
        ) as Localized<Location>;
        return (
          <div key={location.id} className="break-inside-avoid">
            <LocationCard
              location={localizedLocation}
              categoryId={categoryId}
            />
          </div>
        );
      })}
    </div>
  );
}
