// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAclwKPZnR0LUfCFtr-WaSUbTLZd-R1uF4",
  authDomain: "chat-app-6115e.firebaseapp.com",
  projectId: "chat-app-6115e",
  storageBucket: "chat-app-6115e.firebasestorage.app",
  messagingSenderId: "328629702775",
  appId: "1:328629702775:web:525606c59fcbeba6867672"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};