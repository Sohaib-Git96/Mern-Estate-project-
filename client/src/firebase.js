// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-estate-d2ad0.firebaseapp.com",
  projectId: "mern-estate-d2ad0",
  storageBucket: "mern-estate-d2ad0.firebasestorage.app",
  messagingSenderId: "207389676529",
  appId: "1:207389676529:web:7d2182156f6144b67b6a50"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);