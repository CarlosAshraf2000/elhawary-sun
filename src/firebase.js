// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCUUwEqUF_TeAHGLS9fQg4HulnRP8zmUcI",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "elhawary-sun.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "elhawary-sun",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "elhawary-sun.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "94642668824",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:94642668824:web:33c2239179f2794ef00a6d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
