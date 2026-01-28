"use client";
import { useParams } from "next/navigation";
import { useWilaya } from "@/hooks/useWilaya";
import { useLocale } from "next-intl";
import { Wilaya } from "@/lib/service/wilaya";
import { Localized, withResolvedLocale } from "@/lib/utils/localize-fields";
import WilayaHero from "./_components/WilayaHero";
import { WilayaDestinations } from "./_components/WilayaDestinations";

export default function Page() {
  const params = useParams();
  const locale = useLocale() as "en" | "fr" | "ar";
  const currentWilaya = params?.id as string;
  const { data: wilaya, isLoading, isError } = useWilaya(currentWilaya);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-avt-green mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-lg text-gray-600">Loading wilaya...</p>
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">
            Error loading wilaya
          </p>
          <p className="mt-2 text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  if (!wilaya)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800">No wilaya found</p>
        </div>
      </div>
    );

  const localizedWilaya = withResolvedLocale(
    wilaya,
    locale,
  ) as Localized<Wilaya>;

  return (
    <div className="min-h-screen bg-gray-50">
      <WilayaHero wilaya={localizedWilaya} />

      {/* Description Section */}
      {localizedWilaya.t_description && (
        <div className="w-full bg-white pt-4 pb-8 md:pt-6 md:pb-12">
          <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">About</h2>
              <div
                className="prose prose-gray max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: localizedWilaya.t_description.replaceAll(
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

      {/* Destinations Section */}
      <div className="w-full bg-white py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Discover Locations
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Explore the amazing destinations in {localizedWilaya.t_name}
            </p>
          </div>
          <WilayaDestinations locations={localizedWilaya.locations} />
        </div>
      </div>
    </div>
  );
}
