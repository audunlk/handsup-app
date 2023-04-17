import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4k_ZA3GR4m8cLf9Fqf0bVY5rlP5oOxOA",
  authDomain: "handsup-52ea9.firebaseapp.com",
  projectId: "handsup-52ea9",
  storageBucket: "handsup-52ea9.appspot.com",
  messagingSenderId: "670249552437",
  appId: "1:670249552437:web:f4633706bfb07938fa7f7c",
  measurementId: "G-4R647NT273"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig, {
});
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


