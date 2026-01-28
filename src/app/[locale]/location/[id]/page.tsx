"use client";
import { useParams, useSearchParams } from "next/navigation";
import LocationHero from "./_components/LocationHero";
import { useLocation } from "@/hooks/useLocations";
import { useLocale } from "next-intl";
import { Localized, withResolvedLocale } from "@/lib/utils/localize-fields";
import { Location } from "@/lib/service/locations";

export default function Page() {
  const { id: locationId } = useParams();
  const sp = useSearchParams();
  const shouldRefetch = sp.get("refetch") === "true";
  const locale = useLocale() as "en" | "fr" | "ar";

  const { data: location, isFetching } = useLocation(
    `${locationId}`,
    shouldRefetch,
  );

  if (isFetching) return <div>Loading...</div>;
  if (!location) return <div>No location found</div>;

  const localizedLocation = withResolvedLocale(
    location,
    locale,
  ) as Localized<Location>;
  console.log(localizedLocation);

  return (
    <div className="min-h-screen bg-gray-50">
      <LocationHero location={localizedLocation} />

      {/* Description Section */}
      {localizedLocation.t_description && (
        <div className="w-full bg-white pt-4 pb-8 md:pt-6 md:pb-12">
          <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">About</h2>
              <div
                className="prose prose-gray max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: localizedLocation.t_description.replaceAll(
                    /\\r\\n/g,
                    "<br><br>",
                  ),
                }}
                dir="auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
