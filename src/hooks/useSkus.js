import { useQuery } from "@tanstack/react-query";
import { fetchSkus } from "@/api/skus";

export function useSkus(productId) {
  return useQuery({
    queryKey: ["skus", productId],
    queryFn: () => fetchSkus(productId),
    enabled: !!productId,
  });
}
