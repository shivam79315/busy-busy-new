import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const STAR_VALUES = [1, 2, 3, 4, 5];

const deriveSummary = (reviews) => {
  const totalCount = reviews.length;
  const starCounts = STAR_VALUES.reduce((acc, stars) => ({ ...acc, [stars]: 0 }), {});
  let ratingSum = 0;

  reviews.forEach(({ rating }) => {
    ratingSum += rating;
    starCounts[rating] += 1;
  });

  const average = totalCount > 0 ? ratingSum / totalCount : 0;
  const recommendationPercent =
    totalCount > 0
      ? Math.round(((starCounts[5] + starCounts[4]) / totalCount) * 100)
      : 0;
  const breakdown = STAR_VALUES.slice()
    .reverse()
    .map((stars) => ({
      stars,
      percent: totalCount > 0 ? Math.round((starCounts[stars] / totalCount) * 100) : 0,
    }));

  return { totalCount, ratingSum, starCounts, average, recommendationPercent, breakdown };
};

// Recomputed from the reviews subcollection (the source of truth) rather than
// maintained as a running counter, so it can't drift or accumulate corruption
// from a legacy/partial reviewSummary shape on the product doc.
async function refreshReviewSummary(productId) {
  const snapshot = await getDocs(collection(db, "products", productId, "reviews"));
  const reviews = snapshot.docs.map((docSnap) => docSnap.data());

  await updateDoc(doc(db, "products", productId), {
    reviewSummary: deriveSummary(reviews),
  });
}

export async function fetchProductReviews(productId) {
  const snapshot = await getDocs(
    query(collection(db, "products", productId, "reviews"), orderBy("createdAt", "desc"))
  );

  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function fetchUserReview(productId, uid) {
  const snapshot = await getDoc(doc(db, "products", productId, "reviews", uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function submitProductReview({ productId, uid, authorName, rating, title, body }) {
  const reviewRef = doc(db, "products", productId, "reviews", uid);
  const existing = await getDoc(reviewRef);

  await setDoc(reviewRef, {
    uid,
    authorName,
    rating,
    title,
    body,
    createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await refreshReviewSummary(productId);
}

export async function deleteProductReview({ productId, uid }) {
  await deleteDoc(doc(db, "products", productId, "reviews", uid));
  await refreshReviewSummary(productId);
}
