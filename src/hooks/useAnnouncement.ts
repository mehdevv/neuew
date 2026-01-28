import {
  fetchAnnouncements,
  fetchAnnouncementsList,
  fetchCategories,
  getAnnouncementById,
  getAnnouncementsByStoreId,
  getRelatedAnnouncements,
  searchAnnouncements,
  fetchAnnouncementInteractions,
  SearchAnnouncementsParams,
  PaginatedResponse,
} from "@/lib/service/announcements";
import { Announcement, Interaction } from "@/types/announcements";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useAnnouncements = (page?: number) => {
  const queryClient = useQueryClient();

  return useQuery<Announcement[]>({
    queryKey: ["announcements", page],
    queryFn: async () => {
      const announcements = await fetchAnnouncementsList(page);
      // Cache each individual announcement for quick access
      announcements.forEach((announcement) => {
        queryClient.setQueryData(
          ["announcement", announcement.id],
          announcement,
        );
      });
      return announcements;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useInfiniteAnnouncements = () => {
  const queryClient = useQueryClient();

  return useInfiniteQuery<PaginatedResponse<Announcement>>({
    queryKey: ["announcements-infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchAnnouncements(pageParam as number);
      // Cache each individual announcement for quick access
      response.data.forEach((announcement) => {
        queryClient.setQueryData(
          ["announcement", announcement.id],
          announcement,
        );
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAnnouncementsByStoreId = (storeId: string | number) => {
  return useQuery<Announcement[]>({
    queryKey: ["announcements-by-store", storeId],
    queryFn: () => getAnnouncementsByStoreId(storeId),
  });
};

type AnnouncementCategory = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  sub_categories: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }[];
};

export const useAnnouncementCategories = () => {
  return useQuery<AnnouncementCategory[]>({
    queryKey: ["announcement-categories"],
    queryFn: fetchCategories,
    staleTime: "static",
  });
};

export const useRelatedAnnouncements = (id: string | number) => {
  return useQuery<Announcement[]>({
    queryKey: ["announcements-related", id],
    queryFn: () => getRelatedAnnouncements(id),
    staleTime: 1000 * 60 * 60, // cache for 60 min
  });
};

export const useAnnouncementById = (id: string | number) => {
  const queryClient = useQueryClient();

  return useQuery<Announcement>({
    queryKey: ["announcement", id],
    queryFn: async () => await getAnnouncementById(id),
    staleTime: 1000 * 60 * 60, // cache for 60 min
    // Use cached data if available (from list fetch)
    placeholderData: () => {
      const cached = queryClient.getQueryData<Announcement>([
        "announcement",
        id,
      ]);
      return cached;
    },
    // Only refetch if data is stale or missing
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useSearchAnnouncements = (
  params: SearchAnnouncementsParams | null,
) => {
  return useQuery<Announcement[]>({
    queryKey: ["announcements-search", params],
    queryFn: () => searchAnnouncements(params!),
    enabled: params !== null && params.query.trim() !== "",
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAnnouncementInteractions = (
  announcementId: string | number,
) => {
  return useInfiniteQuery<PaginatedResponse<Interaction>>({
    queryKey: ["announcement-interactions", announcementId],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchAnnouncementInteractions(
        Number(announcementId),
        pageParam as number,
      );
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
