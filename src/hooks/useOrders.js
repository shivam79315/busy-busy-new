import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/api/orders";
import { getAuth } from "firebase/auth";

export function useOrders() {
  const uid = getAuth().currentUser?.uid;

  return useQuery({
    queryKey: ["orders", uid],
    queryFn: () => fetchOrders(uid),
    enabled: !!uid,
  });
}