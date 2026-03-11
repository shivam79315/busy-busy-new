import { collection, getDocs } from "firebase/firestore";
import { db } from "@/api/firebase";

export async function fetchUserCart(uid) {
  const snapshot = await getDocs(
    collection(db, "users", uid, "cart")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}