import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-d0563.firebaseapp.com",
  projectId: "mern-blog-d0563",
  storageBucket: "mern-blog-d0563.appspot.com",
  messagingSenderId: "376271269919",
  appId: "1:376271269919:web:95baf121f507afe4d5e52a",
  measurementId: "G-TL4CPWLCD7",
};

export const app = initializeApp(firebaseConfig);
