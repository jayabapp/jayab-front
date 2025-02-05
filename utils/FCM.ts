"use client";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, Messaging, onMessage } from "firebase/messaging";
import { apiRoutes } from "@/utils/urls";
import { apiCall } from "@/api_services/common/apicall.helper";
import Notify from "@/components/shared/Toast";
import { useEffect } from "react";
import firebaseConfig from "./firebase.config";

class FCM {
  static messagingInstance: Messaging;

  static async init() {
    /**
     * Check and request permission
     */
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const granted = await this.requestPermission();
      if (!granted) return;

      if (!this.messagingInstance) {
        const app = initializeApp(firebaseConfig);
        // Initialize Firebase Cloud Messaging and get a reference to the service
        this.messagingInstance = getMessaging(app);

        // Add the public key generated from the console here.
        const token = await getToken(this.messagingInstance, {
          vapidKey: "BPRAmYzDUfXAtV_qBO7LVT0Z_NXdqNShQoYFTgmzOOX6y31HE1O0G2GIpctidLffF79gd7X6ViHXEVcj4peaZzE",
        });

        onMessage(this.messagingInstance, (payload) => {
          console.log("incoming transmition", payload?.notification?.body);
          // if (!window.location.pathname.includes("chat")) {
          // Notify({ body: payload?.notification?.body, title: payload?.notification?.title });
          // }
        });

        // meesaging();

        console.log(token, "tokentokentokentokentoken");
        if (token) {
          this.updateFcm(token);
        } else {
          await this.requestPermission();
        }
      }
    }
  }

  static async requestPermission(): Promise<boolean> {
    console.log("Requesting permission...");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
      return true;
    }
    return false;
  }

  static updateFcm(token: string) {
    apiCall("PATCH", apiRoutes.UPDATE_FCM, {
      fcm_token: token,
    });
  }
}

export default FCM;
