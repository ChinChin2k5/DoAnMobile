import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQ_xApMP9oplsXKexvlDbo9oxIIRtuTB8",
  authDomain: "app-atoza.firebaseapp.com",
  projectId: "app-atoza",
  storageBucket: "app-atoza.firebasestorage.app",
  messagingSenderId: "832551425671",
  appId: "1:832551425671:web:0ee2c72c6b57dff7034a22",
  measurementId: "G-QFQ4X4VY87"
};

const app = initializeApp(firebaseConfig);

// Dùng getAuth — tương thích Expo managed workflow
export const auth = getAuth(app);
export const db = getFirestore(app);