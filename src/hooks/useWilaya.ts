import { useQuery } from "@tanstack/react-query";
import { fetchWilayaById } from "@/lib/service/wilaya";

export function useWilaya(wilayaId: number | string) {
  return useQuery({
    queryKey: ["wilaya", wilayaId],
    queryFn: () => fetchWilayaById(wilayaId),
    enabled: typeof wilayaId !== "undefined",
  });
}
