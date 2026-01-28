import { AgencySubcategory, AgencyUser } from "@/types/announcements";
import { axiosInstance } from "../utils/axios-instant";
import { apiCall } from "../utils/error-handler";

export const fetchAgencyUserById = async (
  id: string,
): Promise<{ user: AgencyUser; subcategories: AgencySubcategory[] }> => {
  return apiCall(
    () =>
      axiosInstance.get<{
        user: AgencyUser;
        subcategories: AgencySubcategory[];
      }>(`api/storeusers/profile`, {
        params: { id },
      }),
    {
      onError: "throw",
      errorMessage: "Failed to fetch store user",
    },
  ).then((res) => res.data);
};
