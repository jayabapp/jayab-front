// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyAFAOLgEjzEdhRD9aRf_-gxqDXvnd4eEjc",
  authDomain: "kheyrieh-zeynabieh.firebaseapp.com",
  projectId: "kheyrieh-zeynabieh",
  storageBucket: "kheyrieh-zeynabieh.appspot.com",
  messagingSenderId: "492110271578",
  appId: "1:492110271578:web:e154816f4debbbde127463",
  measurementId: "G-DBENZPS2MB",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
