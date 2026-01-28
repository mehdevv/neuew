import { Dispatch, SetStateAction, memo, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchAnnouncementsParams } from "@/lib/service/announcements";
import { Loader2 } from "lucide-react";

type Props = {
  filters: SearchAnnouncementsParams;
  setFilters: Dispatch<SetStateAction<SearchAnnouncementsParams>>;
  onSearch: () => void;
  isSearching: boolean;
  isSearchLoading?: boolean;
};

export const AnnouncementsFilter = memo(function AnnouncementsFilter({
  filters,
  setFilters,
  onSearch,
  isSearching,
  isSearchLoading = false,
}: Props) {
  const [query, setQuery] = useState(filters.query || "");

  return (
    <div className="relative flex items-center">
      <div className="w-full md:w-[500px]">
        <Input
          name="query"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim() && !isSearchLoading) {
              setFilters((prev) => ({
                ...prev,
                query: query,
              }));
              onSearch();
            }
          }}
          className="w-full rounded-l-full rounded-r-none border-r-0 focus:ring-0"
        />
      </div>
      <Button
        className="bg-avt-green hover:bg-avt-green/90 rounded-l-none rounded-r-full p-0"
        onClick={() => {
          setFilters((prev) => ({
            ...prev,
            query: query,
          }));
          onSearch();
        }}
        disabled={isSearchLoading || !query.trim()}
      >
        {isSearchLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        ) : (
          <FaMagnifyingGlass className="h-4 w-4 text-white" />
        )}
      </Button>
    </div>
  );
});
