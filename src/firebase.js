// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiUvEEYqysR5BzDW3Rc0pZKGBFnTo3kYM",
  authDomain: "love-letters-3eb5f.firebaseapp.com",
  projectId: "love-letters-3eb5f",
  storageBucket: "love-letters-3eb5f.firebasestorage.app",
  messagingSenderId: "400416963609",
  appId: "1:400416963609:web:61e3299bf4561b14c53e88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);