import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAiXmP-vZ2IKWvsf1CcQ0rO7htrr4kS94k",
  authDomain: "cp-solutions-uploader.firebaseapp.com",
  projectId: "cp-solutions-uploader",
  storageBucket: "cp-solutions-uploader.firebasestorage.app", // sửa lại storageBucket cho đúng
  messagingSenderId: "907622360128",
  appId: "1:907622360128:web:b2c00d3e850823e482eba5",
  measurementId: "G-RYMVJ6XDZ1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Khởi tạo các service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;