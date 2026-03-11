import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../api/firebase";

export async function syncUserToFirestore(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  const userData = {
    uid: user.uid,
    email: user.email,
    name: user.displayName || "User",
    profileImg: user.photoURL || null,
    provider: user.providerData[0]?.providerId || "password",
    emailVerified: user.emailVerified,
    lastLoginAt: serverTimestamp(),
  };

  // Create user if not exists
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      ...userData,
      role: "user",
      createdAt: serverTimestamp(),
    });
  } else {
    // Update only last login + mutable fields
    await setDoc(userRef, userData, { merge: true });
  }
}