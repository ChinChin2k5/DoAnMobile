import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBQ_xApMP9oplsXKexvlDbo9oxIIRtuTB8",
  // Firebase dùng authDomain này làm trung gian xử lý OAuth redirect
  // Nếu để web.app, getRedirectResult sẽ thất bại trên mobile browser
  authDomain: "app-atoza.firebaseapp.com",
  projectId: "app-atoza",
  storageBucket: "app-atoza.firebasestorage.app",
  messagingSenderId: "832551425671",
  appId: "1:832551425671:web:0ee2c72c6b57dff7034a22",
  measurementId: "G-QFQ4X4VY87"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// browserLocalPersistence chỉ khả dụng trên web browser
// Native (Expo Go) tự dùng AsyncStorage persistence — không cần set
if (Platform.OS === 'web') {
  setPersistence(auth, browserLocalPersistence)
    .catch((err) => console.error("[Firebase] Persistence error:", err));
}