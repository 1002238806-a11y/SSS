
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-4jU1jd39Hkbxc7EKCBczM80TYppLFgY",
  authDomain: "hikesupamos.firebaseapp.com",
  projectId: "hikesupamos",
  storageBucket: "hikesupamos.firebasestorage.app",
  messagingSenderId: "506032638892",
  appId: "1:506032638892:web:a70f3e5993b7d1e47f8809",
  measurementId: "G-K1EQYKXTQL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
