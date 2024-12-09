// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtVoKlLq7vJ9HsIThOi7tYzulcIRLqK10",
  authDomain: "kwik-ride-90cc1.firebaseapp.com",
  projectId: "kwik-ride-90cc1",
  storageBucket: "kwik-ride-90cc1.firebasestorage.app",
  messagingSenderId: "536988654914",
  appId: "1:536988654914:web:ef5d72f5aaeb57dd6dfcdb",
  measurementId: "G-KBEWZL09NK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);