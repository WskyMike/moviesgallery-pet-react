// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEKgrY02bNte1T3j2DPxaaK8QkLWwysUc",
  authDomain: "moviegallery-idd3d.firebaseapp.com",
  projectId: "moviegallery-idd3d",
  storageBucket: "moviegallery-idd3d.appspot.com",
  messagingSenderId: "544141712617",
  appId: "1:544141712617:web:67911f7d23a120fcd0e478",
  measurementId: "G-CGCBH369LZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize and export Firestore