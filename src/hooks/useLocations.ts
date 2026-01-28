import {
  fetchLocationById,
  fetchLocations,
  fetchLocationsByCategory,
  Location,
} from "@/lib/service/locations";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useLocation(
  locationId: number | string,
  shouldRefetch = false,
) {
  return useQuery<Location>({
    queryKey: ["location", locationId],
    queryFn: () => fetchLocationById(locationId),
    enabled: shouldRefetch || typeof locationId !== "undefined",
  });
}

export function useLocations() {
  const queryClient = useQueryClient();
  return useQuery<Location[], Error>({
    queryKey: ["locations"],
    queryFn: async () => {
      const locations = await fetchLocations();
      // cache all locations
      locations.forEach((location) => {
        queryClient.setQueryData(["location", location.id], location);
      });
      return locations;
    },
    staleTime: 1000 * 60 * 60, // cache for 60 min
  });
}

export function useLocationsByCategory(categoryId: number) {
  const queryClient = useQueryClient();
  return useQuery<Location[], Error>({
    queryKey: ["locations-by-category", categoryId],
    queryFn: async () => {
      const locations = await fetchLocationsByCategory(categoryId);
      // cache all locations
      locations.forEach((location) => {
        queryClient.setQueryData(["location", location.id], location);
      });
      return locations;
    },
    enabled: !!categoryId, // only run if categoryId is truthy
    staleTime: 1000 * 60 * 60, // cache for 60 min
  });
}
