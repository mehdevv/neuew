import { fetchAgencyUserById } from "@/lib/service/agency";
import { useQuery } from "@tanstack/react-query";

export const useAgencyUser = (id:  string) => {
  return useQuery({
    queryKey: ["storeUser", id],
    queryFn: () => fetchAgencyUserById(id),
    enabled: !!id,
  });
};
