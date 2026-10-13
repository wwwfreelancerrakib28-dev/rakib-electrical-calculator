import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKabSFr2BebDwyuAOaJwnncRWLgR2zjds",
  authDomain: "rakib-electrical-calculator.firebaseapp.com",
  projectId: "rakib-electrical-calculator",
  storageBucket: "rakib-electrical-calculator.firebasestorage.app",
  messagingSenderId: "270132252355",
  appId: "1:270132252355:web:5e6e3a910228d6920b1c76",
  measurementId: "G-D2417EC6LQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
