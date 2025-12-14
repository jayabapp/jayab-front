// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyDh-CXlfWaBntX7UPiydTfZzpoNBt7-TBY",
  authDomain: "jayab-test.firebaseapp.com",
  projectId: "jayab-test",
  storageBucket: "jayab-test.firebasestorage.app",
  messagingSenderId: "138259528516",
  appId: "1:138259528516:web:489551fa384ea76e0f3511",
  measurementId: "G-HJFMG6DHYG",
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

  navigator.serviceWorker.ready.then(function (registration) {
    registration.showNotification(notificationTitle, notificationOptions);
  });
});

// messaging.onBackgroundMessage((payload) => {
//   if (payload.notification) {
//     // Browser already displayed it
//     return;
//   }

//   self.registration.showNotification("payload.notification.title", {
//     body: "payload.notification.body",
//     data: payload.data,
//   });
// });

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   console.log("✅ CLICK FIRED", event.notification.data);

//   const { type, chatroom_id } = event.notification.data;

//   let url = "/";
//   if (type === "chat") url = `/chat/${chatroom_id}`;

//   event.waitUntil(clients.openWindow(url));
// });
