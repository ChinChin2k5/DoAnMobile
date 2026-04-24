// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//tạm ẩn Analytics để tránh lỗi trên máy ảo trên App Expo
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ_xApMP9oplsXKexvlDbo9oxIIRtuTB8",
  authDomain: "app-atoza.firebaseapp.com",
  projectId: "app-atoza",
  storageBucket: "app-atoza.firebasestorage.app",
  messagingSenderId: "832551425671",
  appId: "1:832551425671:web:0ee2c72c6b57dff7034a22",
  measurementId: "G-QFQ4X4VY87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app); //tạm ẩn để tránh lỗi trên App Expo
//Bắt buộc phải khởi tạo và xuất ra ngoài (CẤM ĐỘNG VÀO)
export const db=getFirestore(app);