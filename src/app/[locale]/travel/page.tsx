"use client";
import {
  useInfiniteAnnouncements,
  useSearchAnnouncements,
} from "@/hooks/useAnnouncement";
import { AnnouncementsFilter } from "./_components/AnnouncementsFilter";
import { AnnouncementFilterDialog } from "./_components/AnnouncementFilterDialog";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  TravelAnnouncementCard,
  TravelCardSkeleton,
} from "@/components/TravelAnnouncementCard";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { SearchAnnouncementsParams } from "@/lib/service/announcements";

export default function TravelPage() {
  const t = useTranslations("TravelAnn");

  const [filters, setFilters] = useState<SearchAnnouncementsParams>({
    query: "",
  });

  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] =
    useState<SearchAnnouncementsParams | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteAnnouncements();

  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchAnnouncements(searchParams);

  // Flatten all pages into a single array
  const allAnnouncements = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  // Handle search
  const handleSearch = useCallback(() => {
    if (filters.query.trim() === "") {
      setIsSearching(false);
      setSearchParams(null);
      return;
    }

    // Build params from filters
    const params: SearchAnnouncementsParams = {
      query: filters.query.trim().toLowerCase(),
      category: filters.category || null,
      prix_start: filters.prix_start || null,
      prix_end: filters.prix_end || null,
      date_start: filters.date_start || null,
      date_end: filters.date_end || null,
    };

    setIsSearching(true);
    setSearchParams(params);
  }, [filters]);

  // Determine which announcements to display
  const displayedAnnouncements = useMemo(() => {
    return allAnnouncements;
  }, [allAnnouncements]);

  // Intersection Observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="divide-y divide-zinc-300">
      <div className="mx-auto w-full bg-white p-4 shadow lg:p-6">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
          <h1 className="text-2xl font-bold whitespace-nowrap text-gray-900">
            Travel Announcements
          </h1>
          <div className="flex flex-1 items-center justify-end gap-4">
            <AnnouncementsFilter
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearch}
              isSearching={isSearching}
              isSearchLoading={isSearchLoading}
            />
            <AnnouncementFilterDialog
              value={filters}
              onAction={(val) => setFilters((prev) => ({ ...prev, ...val }))}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-full rounded-lg bg-zinc-100 p-1 lg:p-6">
        {/* Search Results Section */}
        {isSearching && (
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Search Results
            </h2>
            {isSearchLoading && (
              <div className="grid w-full grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <TravelCardSkeleton key={`search-loading-${i}`} />
                ))}
              </div>
            )}
            {!isSearchLoading && searchResults && (
              <>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                    {searchResults.map((announcement) => (
                      <TravelAnnouncementCard
                        key={"search-result-" + announcement.id}
                        announcement={announcement}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    <p>No results found for your search</p>
                  </div>
                )}
              </>
            )}
            {searchError && (
              <div className="py-6 text-center text-red-500">
                <p>Error loading search results</p>
              </div>
            )}
          </div>
        )}

        {/* Regular Announcements Section */}
        <div>
          {isSearching && (
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              All Announcements
            </h2>
          )}
          {isLoading && (
            <div className="grid w-full grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <TravelCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="py-10 text-center">
              <p className="text-zinc-600">{t("no_results_found")}</p>
            </div>
          )}

          {displayedAnnouncements.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                {displayedAnnouncements.map((announcement) => (
                  <TravelAnnouncementCard
                    key={"announcement-" + announcement.id}
                    announcement={announcement}
                  />
                ))}
              </div>

              {/* Infinite scroll for regular announcements */}
              {isFetchingNextPage && (
                <div className="mt-6 grid w-full grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <TravelCardSkeleton key={`loading-${i}`} />
                  ))}
                </div>
              )}
              {/* Intersection observer target for auto-loading */}
              {hasNextPage && (
                <div ref={loadMoreRef} className="mt-6 flex justify-center">
                  <div onClick={() => fetchNextPage()}>
                    <Loader2 className="size-6 animate-spin text-zinc-400" />
                  </div>
                </div>
              )}

              {!hasNextPage && allAnnouncements.length > 0 && (
                <div className="mt-6 text-center text-gray-500">
                  <p>No more announcements to load</p>
                </div>
              )}
            </>
          )}

          {!isSearching &&
            displayedAnnouncements.length === 0 &&
            !isLoading && (
              <div className="py-10 text-center">
                <p className="text-zinc-600">No announcements available</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
