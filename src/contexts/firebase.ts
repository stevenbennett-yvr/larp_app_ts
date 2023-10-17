import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { getStorage, ref as sRef } from "firebase/storage"
import { getDatabase, ref as dbRef } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCG2ZgFb_E21MuCn6A8J9WxcX_6AOLC66k",
  authDomain: "larp-app-5a526.firebaseapp.com",
  projectId: "larp-app-5a526",
  storageBucket: "larp-app-5a526.appspot.com",
  messagingSenderId: "1040168047608",
  appId: "1:1040168047608:web:e25c33eb971dc906687c0d",
  measurementId: "G-FV6X3219Z4"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

// DB Ref
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
export const realTimeDatabaseRef = dbRef(rtdb, 'users/'); // Use the databaseRef function for database references

// Storage References
export const storage = getStorage(app)
export const storageRef = sRef(storage)
