import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'

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
export const db = getFirestore(app)