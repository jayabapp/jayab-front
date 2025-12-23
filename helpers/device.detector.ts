"use server";

import { headers } from "next/headers";
import { userAgent } from "next/server";

export type DeviceType = "mobile" | "tablet" | "desktop" | "console" | "smarttv" | "wearable" | "embedded" | "unknown";

export type DeviceInfo = {
  type: DeviceType;

  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  isConsole: boolean;
  isSmartTV: boolean;
  isWearable: boolean;
};

const deviceTypeDetector = async (): Promise<DeviceInfo> => {
  const headerValues = await headers();
  const { device } = userAgent({ headers: headerValues });

  const type = device?.type;

  return {
    type: (type ?? "desktop") as DeviceType,

    isMobile: type === "mobile",
    isTablet: type === "tablet",

    // desktop is a *derived* concept
    isDesktop: !type || type === "desktop" || type === "embedded",

    isConsole: type === "console",
    isSmartTV: type === "smarttv",
    isWearable: type === "wearable",
  };
};

export default deviceTypeDetector;
