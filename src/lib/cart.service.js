import {
  doc,
  setDoc,
  getDoc,
  increment,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/api/firebase";

import { getAuth } from "firebase/auth";
import { toast } from "sonner";
import { withAuthGuard } from "./auth-guard";

async function addCartItem(uid, productId) {
  const cartRef = doc(db, "users", uid, "cart", productId);

  const existing = await getDoc(cartRef);

  if (existing.exists()) {
    await setDoc(
      cartRef,
      { quantity: increment(1) },
      { merge: true }
    );
  } else {
    await setDoc(cartRef, {
      productId,
      quantity: 1,
      addedAt: serverTimestamp()
    });
  }
}

export async function handleAddToCart({
  productId,
  isAuthenticated,
  navigate,
  redirectTo
}) {
  await withAuthGuard({
    isAuthenticated,
    navigate,
    redirectTo,
    fallbackErrorMessage: "Unable to add item to cart.",
    callback: async () => {
      const uid = getAuth().currentUser.uid;
      await addCartItem(uid, productId);
      toast.success("Added to cart.");
    }
  });
}