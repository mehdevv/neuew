import { axiosInstance } from "../utils/axios-instant";
import { apiCall } from "../utils/error-handler";
import { Location } from "./locations";

export type Wilaya = {
  id: number;
  name_fr: string;
  name_ar: string;
  name_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  pic_cover: string;
  pic_map: string;
  matricule: number;
  latitude: string;
  longitude: string;
  url_maps?: string | null;
  is_visible: number;
  created_at: string;
  updated_at: string;
  locations: Location[];
};

export async function fetchWilayaById(id: number | string) {
  return apiCall(
    () => axiosInstance.get<{ wilaya: Wilaya }>(`api/wilayas/wilaya/${id}`),
    {
      onError: "throw",
      errorMessage: "Failed to fetch wilaya",
    },
  ).then((res) => res.data.wilaya);
}
