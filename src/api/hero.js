import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const heroSlidesRef = collection(db, "heroSlides");

const mapSnapshot = (snapshot) =>
  snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

export async function fetchActiveHeroSlides() {
  // Filtering "active" client-side avoids needing a composite index for
  // what's a handful of marketing slides, not a query at real scale.
  const snapshot = await getDocs(query(heroSlidesRef, orderBy("order", "asc")));
  return mapSnapshot(snapshot).filter((slide) => slide.active);
}

export async function fetchAllHeroSlides() {
  const snapshot = await getDocs(query(heroSlidesRef, orderBy("order", "asc")));
  return mapSnapshot(snapshot);
}

export async function createHeroSlide(data) {
  await addDoc(heroSlidesRef, data);
}

export async function updateHeroSlide(id, data) {
  await updateDoc(doc(db, "heroSlides", id), data);
}

export async function deleteHeroSlide(id) {
  await deleteDoc(doc(db, "heroSlides", id));
}
