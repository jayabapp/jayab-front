import localFont from "next/font/local";

export const x_Iransans = localFont({
  display: "swap",
  preload: false,
  src: [
    // Weights follow each file's OS/2 usWeightClass: Thin=100, Light=300.
    // They were swapped (Light→200, Thin→300), so `font-light` rendered Thin.
    {
      path: "./IRANSansX-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./IRANSansX-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./IRANSansX-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./IRANSansX-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./IRANSansX-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },

    {
      path: "./IRANSansX-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});
