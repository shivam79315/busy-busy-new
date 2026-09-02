import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProductReview,
  fetchProductReviews,
  fetchUserReview,
  submitProductReview,
} from "@/api/reviews";

export function useProductReviews(productId) {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => fetchProductReviews(productId),
    enabled: !!productId,
  });
}

export function useUserReview(productId, uid) {
  return useQuery({
    queryKey: ["product-review", productId, uid],
    queryFn: () => fetchUserReview(productId, uid),
    enabled: !!productId && !!uid,
  });
}

const invalidateReviewQueries = (queryClient, { productId, uid }) => {
  queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
  queryClient.invalidateQueries({ queryKey: ["product-review", productId, uid] });
  queryClient.invalidateQueries({ queryKey: ["product", productId] });
};

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitProductReview,
    onSuccess: (_data, variables) => invalidateReviewQueries(queryClient, variables),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductReview,
    onSuccess: (_data, variables) => invalidateReviewQueries(queryClient, variables),
  });
}
