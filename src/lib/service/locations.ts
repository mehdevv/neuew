import { SEARCH_CATEGORIES } from "../constants/search-categories";
import { axiosInstance } from "../utils/axios-instant";
import { apiCall } from "../utils/error-handler";

export type Location = {
  id: number;
  wilaya_id: number;
  name_fr: string;
  name_ar: string;
  name_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  type: string;
  pic_cover: string;
  visit_360_url: string;
  url_maps?: string | null;
  latitude: string;
  longitude: string;
  // ISO date string
  created_at: string;
  updated_at: string;
};

export async function fetchLocations(): Promise<Location[]> {
  return apiCall(
    () => axiosInstance.get<{ locations: Location[] }>(`api/locations`),
    {
      onError: "throw",
      errorMessage: "Failed to fetch locations",
    },
  ).then((res) => res.data.locations);
}

export async function fetchLocationById(
  id: number | string,
): Promise<Location> {
  return apiCall(
    () =>
      axiosInstance.get<{ locations: Location }>(
        `api/locations/location/${id}`,
      ),
    {
      onError: "throw",
      errorMessage: "Failed to fetch location",
    },
  ).then((res) => res.data.locations);
}

export async function fetchLocationsByCategory(
  categoryId: number,
): Promise<Location[]> {
  const res = await apiCall(
    () => axiosInstance.get<{ locations: Location[] }>(`api/locations`),
    {
      onError: "throw",
      errorMessage: "Failed to fetch locations",
    },
  );

    const categoryDbTypeName = SEARCH_CATEGORIES.find(
      (c) => c.id === categoryId,
    )?.dbTypeName;

    if (categoryDbTypeName === undefined) {
      throw new Error("Category not found");
    }

    const locations = res.data.locations.filter(
      ({ type }: Location) => type === categoryDbTypeName,
    ) as Location[];

    return locations;
}
