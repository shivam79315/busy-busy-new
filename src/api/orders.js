import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function fetchOrders(uid) {
  const snapshot = await getDocs(
    collection(db, "users", uid, "orders")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}