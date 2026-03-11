import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function fetchProducts() {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getProductById(productId) {
  const q = query(
    collection(db, "products"),
    where("productId", "==", productId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs[0].data();
}