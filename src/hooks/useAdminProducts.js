import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, updateProduct } from "@/api/products";

const invalidateProductQueries = (queryClient, productId) => {
  queryClient.invalidateQueries({ queryKey: ["products"] });
  if (productId) {
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
  }
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
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
