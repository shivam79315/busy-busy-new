import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, updateProduct } from "@/api/products";
import { saveSkus } from "@/api/skus";
import { validateProduct } from "@/lib/productSchema";

const invalidateProductQueries = (queryClient, productId) => {
  queryClient.invalidateQueries({ queryKey: ["products"] });
  if (productId) {
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
  }
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => {
      const { valid, errors } = validateProduct(data);
      if (!valid) throw new Error(errors.join(" "));
      return updateProduct(id, data);
    },
    onSuccess: (_data, variables) => invalidateProductQueries(queryClient, variables.id),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => invalidateProductQueries(queryClient),
  });
}

export function useSaveSkus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, skus }) => saveSkus(productId, skus),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["skus", variables.productId] });
    },
  });
}
