// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFS4Kq7755WS1qJihfuGGVvhAbqjeHb-8",
  authDomain: "usermanagement-ab1ae.firebaseapp.com",
  projectId: "usermanagement-ab1ae",
  storageBucket: "usermanagement-ab1ae.firebasestorage.app",
  messagingSenderId: "789543642010",
  appId: "1:789543642010:web:4688d8725bb0cb1719d023",
  measurementId: "G-67WGR1PY24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
// Secondary App for User Creation
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);

export const db = getFirestore(app);
export default app;