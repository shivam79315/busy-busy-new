import {
  doc,
  setDoc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  getDocs,
  collection
} from "firebase/firestore";
import { db } from "@/api/firebase";

import { getAuth } from "firebase/auth";

/*
users
  uid
    wishlist
      productId
        productId: "abc"
*/

export const addToWishlist = async (productId) => {
  const uid = getAuth().currentUser.uid;

  const ref = doc(db, "users", uid, "wishlist", productId);

  await setDoc(ref, {
    productId
  });
};

export const removeFromWishlist = async (productId) => {
  const uid = getAuth().currentUser.uid;

  const ref = doc(db, "users", uid, "wishlist", productId);

  await deleteDoc(ref);
};

export const fetchWishlist = async () => {
  try {
    const uid = getAuth().currentUser?.uid;

    if (!uid) {
      throw new Error("User not authenticated.");
    }

    const snapshot = await getDocs(
      collection(db, "users", uid, "wishlist")
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};