import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";
import { deleteAllSkus } from "./skus";

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

export async function updateProduct(id, data) {
  await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id) {
  await deleteAllSkus(id);
  await deleteDoc(doc(db, "products", id));
}

export async function fetchProductsByIds(productIds) {
  if (!productIds?.length) return [];

  const q = query(
    collection(db, "products"),
    where("productId", "in", productIds)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}