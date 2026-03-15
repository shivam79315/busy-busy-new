import { doc, getDoc } from "firebase/firestore";
import { db } from "@/api/firebase";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductsByIds } from "@/api/products";

async function fetchProduct(productId) {
  const snapshot = await getDoc(doc(db, "products", productId));
  return { id: snapshot.id, ...snapshot.data() };
}

export function useProduct(productId) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}

export function useRelatedProducts(category) {
  return useQuery({
    queryKey: ["related-products", category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category
  });
}

export function useProductsByIds(productIds) {
  return useQuery({
    queryKey: ["products-by-ids", productIds],
    queryFn: () => fetchProductsByIds(productIds),
    enabled: productIds?.length > 0
  });
}