importScripts(
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBFS4Kq7755WS1qJihfuGGVvhAbqjeHb-8",
  authDomain: "usermanagement-ab1ae.firebaseapp.com",
  projectId: "usermanagement-ab1ae",
  storageBucket: "usermanagement-ab1ae.firebasestorage.app",
  messagingSenderId: "789543642010",
  appId: "1:789543642010:web:4688d8725bb0cb1719d023",
});

const messaging = firebase.messaging();
