// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore import
import { getAuth } from "firebase/auth"; // (optional) Auth import
import { getStorage } from "firebase/storage"; // (optional) Storage import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFTdiGj9lwm6te-BrAjblKxue7b7AxIJE",
  authDomain: "login-60ced.firebaseapp.com",
  projectId: "login-60ced",
  storageBucket: "login-60ced.firebasestorage.app",
  messagingSenderId: "883667275503",
  appId: "1:883667275503:web:a1d26ddf9a93bd0d78551a",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);   // ✅ Firestore database
const auth = getAuth(app);      // (optional) Authentication
const storage = getStorage(app); // (optional) Storage

export { db, auth, storage };
