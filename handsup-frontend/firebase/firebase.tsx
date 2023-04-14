import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from 'expo-constants';


const firebaseConfig = {
  apiKey: process.env.handsup_FIREBASE_API_KEY,
  authDomain: process.env.handsup_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.handsup_FIREBASE_PROJECT_ID,
  storageBucket: process.env.handsup_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.handsup_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.handsup_FIREBASE_APP_ID,
  measurementId: process.env.handsup_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase


  const app = initializeApp(firebaseConfig, {
});
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


