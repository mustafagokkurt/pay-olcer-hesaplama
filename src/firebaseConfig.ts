// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXzrZ1ofhT13Mog8ZDMoLsHG61CJOkMQE",
  authDomain: "pay-olcer-db.firebaseapp.com",
  projectId: "pay-olcer-db",
  storageBucket: "pay-olcer-db.appspot.com",
  messagingSenderId: "521420712265",
  appId: "1:521420712265:web:03b6eccf99d9c86be7d298",
  measurementId: "G-M0MR4VCV8M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
