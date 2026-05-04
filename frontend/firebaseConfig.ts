// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQ85QZKgeLNqRLMd5-d5bY9DWmewGed-0",
  authDomain: "periodtrackerapp-1de4d.firebaseapp.com",
  projectId: "periodtrackerapp-1de4d",
  storageBucket: "periodtrackerapp-1de4d.firebasestorage.app",
  messagingSenderId: "803275997106",
  appId: "1:803275997106:web:3c8dfb452b6a0a81616eab",
  measurementId: "G-8171Q5P1ZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);