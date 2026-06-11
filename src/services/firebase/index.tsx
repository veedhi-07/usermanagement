// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
  measurementId: "G-67WGR1PY24",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const setupNotification = async () => {
//   const supported = await isSupported();

//   if (!supported) {
//     console.log("Messaging not supported");
//     return;
//   }
//   const messaging = getMessaging(app);
//   try {
//     //request permission for notifications
//     const permission = await Notification.requestPermission();

//     if (permission === "granted") {
//       console.log("Notification permission granted");

//       // Get the Firebase cloud messaging(FCM) token
//       const token = await getToken(messaging, {
//         vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
//       });
//       console.log("FCM Token", token);
//       return token;
//     } else {
//       console.log("Notification permission denied");
//     }
//   } catch (error) {
//     console.error("Error setting up notifications", error);
//   }
// };
// export { setupNotification };

export const auth = getAuth(app);
console.log("Authh registered");

export const db = getFirestore(app);

// // Secondary App for User Creation
const secondaryApp = initializeApp(firebaseConfig, "Secondary");

export const secondaryAuth = getAuth(secondaryApp);

export default app;
