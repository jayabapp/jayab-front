"use client";

import { Messaging } from "firebase/messaging";
import { apiRoutes } from "@/utils/urls";
import { apiCall } from "@/api_services/common/apicall.helper";

import firebaseConfig from "./firebase.config";

class FCM {
  static messagingInstance: Messaging;
  static async init() {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const granted = await this.requestPermission();
      if (!granted) return;
      if (!this.messagingInstance) {
        const [{ initializeApp }, { getMessaging, getToken }] =
          await Promise.all([
            import("firebase/app"),
            import("firebase/messaging"),
          ]);
        const app = initializeApp(firebaseConfig);
        this.messagingInstance = getMessaging(app);
        const token = await getToken(this.messagingInstance, {
          vapidKey:
            "BPRAmYzDUfXAtV_qBO7LVT0Z_NXdqNShQoYFTgmzOOX6y31HE1O0G2GIpctidLffF79gd7X6ViHXEVcj4peaZzE",
        });
        if (token) this.updateFcm(token);
        else await this.requestPermission();
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
