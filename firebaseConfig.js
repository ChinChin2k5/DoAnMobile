import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQ_xApMP9oplsXKexvlDbo9oxIIRtuTB8",
  authDomain: "app-atoza.firebaseapp.com",
  projectId: "app-atoza",
  storageBucket: "app-atoza.firebasestorage.app",
  messagingSenderId: "832551425671",
  appId: "1:832551425671:web:0ee2c72c6b57dff7034a22",
  measurementId: "G-QFQ4X4VY87"
};

// Khởi tạo an toàn: Có rồi thì lấy dùng lại, chưa có thì tạo mới
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth;

// Phân tách lưu trữ rõ ràng giữa Web và Mobile
if (Platform.OS === 'web') {
  // Web đã tự động quản lý persistence, chỉ cần getAuth là đủ
  auth = getAuth(app); 
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      console.error("Firebase Auth Error:", error);
    }
  }
}

const db = getFirestore(app);

export { auth, db };