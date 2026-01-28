import {
  Announcement,
  Interaction,
  AnnouncementInteractionsResponse,
} from "@/types/announcements";
import { axiosInstance } from "../utils/axios-instant";
import { useAuthStore } from "@/store/auth";
import { apiCall } from "../utils/error-handler";

/**
 * Normalizes photo paths by removing excessive backslashes
 * Converts paths like "storage\\\\announcements\\\\photo.jpg" to "storage/announcements/photo.jpg"
 */
function normalizePhotoPath(path: string): string {
  if (!path) return path;
  // Replace all backslashes with forward slashes
  return path.replace(/\\+/g, "/");
}

/**
 * Normalizes photo paths in an announcement
 */
function normalizeAnnouncementPhotos(announcement: Announcement): Announcement {
  if (announcement.photos && Array.isArray(announcement.photos)) {
    return {
      ...announcement,
      photos: announcement.photos.map(normalizePhotoPath),
    };
  }
  return announcement;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const fetchAnnouncements = async (
  page?: number,
): Promise<PaginatedResponse<Announcement>> => {
  return apiCall(
    () =>
      axiosInstance.get("/api/announcements/active/announcements", {
        params: page ? { page } : undefined,
      }),
    {
      onError: "throw",
      errorMessage: "Failed to fetch announcements",
    },
  ).then((res) => ({
    ...res.data,
    data: res.data.data.map(normalizeAnnouncementPhotos),
  }));
};
// Helper function to get just the announcements array (for backward compatibility)
export const fetchAnnouncementsList = async (
  page?: number,
): Promise<Announcement[]> => {
  const response = await fetchAnnouncements(page);
  return response.data;
};

export const deleteAnnouncement = async (
  id: string | number,
): Promise<{ message: string }> => {
  return apiCall(
    () =>
      axiosInstance.delete<{ message: string }>(
        `/api/announcements/${id}/delete`,
      ),
    {
      onError: "throw",
      errorMessage: "Failed to delete announcement",
    },
  ).then((res) => res.data);
};

export const fetchCategories = async () => {
  return apiCall(() => axiosInstance.get("/api/categories"), {
    onError: "throw",
    errorMessage: "Failed to fetch categories",
  }).then((res) => res.data);
};

export const getAnnouncementById = async (
  id: string | number,
): Promise<Announcement> => {
  return apiCall(() => axiosInstance.get(`/api/announcements/${id}/show`), {
    onError: "throw",
    errorMessage: "Failed to fetch announcement",
  }).then((res) => normalizeAnnouncementPhotos(res.data.announcement));
};

export const getRelatedAnnouncements = async (
  id: string | number,
): Promise<Announcement[]> => {
  return apiCall(
    () =>
      axiosInstance.get(`/api/announcements/similar`, {
        params: { id },
      }),
    {
      onError: "throw",
      errorMessage: "Failed to fetch related announcements",
    },
  ).then((res) => (res.data.data || []).map(normalizeAnnouncementPhotos));
};

export interface SearchAnnouncementsParams {
  query: string;
  category?: string | null;
  subcategory?: string | null;
  prix_start?: string | null;
  prix_end?: string | null;
  date_start?: string | null;
  date_end?: string | null;
}

export const searchAnnouncements = async (
  params: SearchAnnouncementsParams,
): Promise<Announcement[]> => {
  const searchParams: Record<string, string> = {
    destination: params.query,
    titre: params.query,
  };

  if (params.category) {
    searchParams.category = params.category;
  }
  if (params.subcategory) {
    searchParams.subcategory = params.subcategory;
  }
  if (params.prix_end) {
    searchParams.prix_end = params.prix_end;
    searchParams.prix_start = "0";
  }
  if (params.prix_start) {
    searchParams.prix_start = params.prix_start;
  }
  if (params.date_start) {
    searchParams.date_start = params.date_start;
  }
  if (params.date_end) {
    searchParams.date_end = params.date_end;
  }

  return apiCall(
    () =>
      axiosInstance.post<Announcement[]>(`/api/announcements/search`, {
        ...searchParams,
      }),
    {
      onError: "throw",
      errorMessage: "Failed to search announcements",
    },
  ).then((res) => (res.data || []).map(normalizeAnnouncementPhotos));
};

export const getAnnouncementsByStoreId = async (
  storeId: string | number,
  flat: boolean = true,
): Promise<Announcement[]> => {
  const res = await apiCall(
    () =>
      axiosInstance.get<{
        subcategories?: Array<{ announcements: Announcement[] }>;
      }>("/api/storeusers/profile", {
        params: {
          id: storeId,
        },
      }),
    {
      onError: "throw",
      errorMessage: "Failed to fetch announcements",
    },
  );

  if (res.data) {
    if (flat && res.data.subcategories) {
      return res.data.subcategories
        .flatMap((s) => s.announcements as Announcement[])
        .map(normalizeAnnouncementPhotos) as Announcement[];
    } else {
      const announcements = res.data as unknown as Announcement[];
      return Array.isArray(announcements)
        ? announcements.map(normalizeAnnouncementPhotos)
        : [];
    }
  }
  return [];
};

export const addComment = async (
  announcementId: number,
  content: string,
  commentId?: number, // Optional, for updating existing comments
): Promise<{
  message: string;
}> => {
  // Validate comment length (max 500 chars)
  const trimmedContent = content.trim();
  if (trimmedContent.length > 500) {
    throw new Error("Comment must be 500 characters or less");
  }
  if (trimmedContent.length === 0) {
    throw new Error("Comment cannot be empty");
  }

  const body: {
    announcement_id: number;
    content: string;
    comment_id?: number;
  } = {
    announcement_id: announcementId,
    content: trimmedContent,
  };

  if (commentId) {
    body.comment_id = commentId;
  }

  return apiCall(
    () =>
      axiosInstance.post<{ message: string }>(
        `/api/interactions/comment`,
        body,
      ),
    {
      onError: "throw",
      errorMessage: "Failed to add comment",
    },
  ).then((res) => res.data);
};

export interface InteractionParams {
  announcement_id: number;
  liked?: boolean;
  bookmarked?: boolean;
  rating?: number | null; // nullable, between 1-5
}

export const toggleLike = async (
  announcementId: number,
  liked: boolean,
  bookmarked: boolean = false,
  rating: number | null = null,
): Promise<{
  message: string;
  data: Interaction;
}> => {
  // Validate rating if provided
  if (rating !== null && (rating < 1 || rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  const body: {
    announcement_id: number;
    liked: boolean;
    bookmarked: boolean;
    rating?: number | null;
  } = {
    announcement_id: announcementId,
    liked,
    bookmarked,
  };

  // Only include rating if provided
  if (rating !== null && rating !== undefined) {
    body.rating = rating;
  }

  return apiCall(
    () =>
      axiosInstance.post<{
        message: string;
        data: Interaction;
      }>(`/api/interactions`, body),
    {
      onError: "throw",
      errorMessage: "Failed to update interaction",
    },
  ).then((res) => res.data);
};

export const toggleBookmark = async (
  announcementId: number,
  bookmarked: boolean,
  liked: boolean = false,
  rating: number | null = null,
): Promise<{
  message: string;
  data: Interaction;
}> => {
  // Validate rating if provided
  if (rating !== null && (rating < 1 || rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  const body: {
    announcement_id: number;
    liked: boolean;
    bookmarked: boolean;
    rating?: number | null;
  } = {
    announcement_id: announcementId,
    liked,
    bookmarked,
  };

  // Only include rating if provided
  if (rating !== null && rating !== undefined) {
    body.rating = rating;
  }

  return apiCall(
    () =>
      axiosInstance.post<{
        message: string;
        data: Interaction;
      }>(`/api/interactions`, body),
    {
      onError: "throw",
      errorMessage: "Failed to update bookmark",
    },
  ).then((res) => res.data);
};

export const addRating = async (
  announcementId: number,
  rating: number,
  liked: boolean = false,
  bookmarked: boolean = false,
): Promise<{
  message: string;
  data: Interaction;
}> => {
  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  return apiCall(
    () =>
      axiosInstance.post<{
        message: string;
        data: Interaction;
      }>(`/api/interactions`, {
        announcement_id: announcementId,
        liked,
        bookmarked,
        rating,
      }),
    {
      onError: "throw",
      errorMessage: "Failed to add rating",
    },
  ).then((res) => res.data);
};

export const fetchAnnouncementInteractions = async (
  announcementId: number,
  page: number = 1,
): Promise<PaginatedResponse<Interaction>> => {
  return apiCall(
    () =>
      axiosInstance.post<{ data: PaginatedResponse<Interaction> }>(
        `/api/interactions/announcement`,
        {
          announcement_id: announcementId,
          page,
        },
      ),
    {
      onError: "throw",
      errorMessage: "Failed to fetch interactions",
    },
  ).then((res) => res.data.data);
};
