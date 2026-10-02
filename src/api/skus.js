import { collection, deleteDoc, doc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

export async function fetchSkus(productId) {
  const snapshot = await getDocs(collection(db, "products", productId, "skus"));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

// Upserts the given skus and deletes any existing ones not present anymore
// (e.g. a variant option was removed), in one atomic batch.
export async function saveSkus(productId, skus) {
  const existing = await fetchSkus(productId);
  const nextIds = new Set(skus.map((sku) => sku.id));

  const batch = writeBatch(db);

  skus.forEach((sku) => {
    batch.set(doc(db, "products", productId, "skus", sku.id), {
      optionValues: sku.optionValues,
      stock: sku.stock,
      inventoryPolicy: sku.inventoryPolicy || "deny",
    });
  });

  existing.forEach((sku) => {
    if (!nextIds.has(sku.id)) {
      batch.delete(doc(db, "products", productId, "skus", sku.id));
    }
  });

  await batch.commit();
}

export async function deleteAllSkus(productId) {
  const existing = await fetchSkus(productId);
  await Promise.all(
    existing.map((sku) => deleteDoc(doc(db, "products", productId, "skus", sku.id)))
  );
}
