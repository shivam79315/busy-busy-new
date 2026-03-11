// src/api/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTdp8JNW78ruX-cj4c4_blkoTQI2E1X7U",
  authDomain: "busy-busy-53b2e.firebaseapp.com",
  databaseURL: "https://busy-busy-53b2e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "busy-busy-53b2e",
  storageBucket: "busy-busy-53b2e.firebasestorage.app",
  messagingSenderId: "732589184003",
  appId: "1:732589184003:web:74a43173ca4d8ebde8aa36",
  measurementId: "G-L036N1ZPHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;