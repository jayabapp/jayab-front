"use client";

import { x_Iransans } from "@/app/fonts/x_iran/x_Iransans";
import { ReactNode } from "react";
import { isMobile } from "react-device-detect";
import { toast } from "sonner";

import successIcon from "@/public/assets/lotties/notif/Success.json";
import warningIcon from "@/public/assets/lotties/notif/Warning.json";
import errorIcon from "@/public/assets/lotties/notif/Error.json";
import infoIcon from "@/public/assets/lotties/notif/Info.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });
interface props {
  body?: string;
  title?: string;
  children?: ReactNode;
  cb?: () => void | null;
  type?: "success" | "error" | "warn" | "info";
}
const Notify = (props: props) => {
  const { type = "info", body, cb, children } = props || {};

  const _findTypeData = () => {
    switch (type) {
      case "success":
        return { icon: successIcon, border: "border-r-green-500" };
      case "error":
        return { icon: errorIcon, border: "border-r-rose-500" };
      case "warn":
        return { icon: warningIcon, border: "border-r-yellow-400" };
      case "info":
        return { icon: infoIcon, border: "border-r-sky-400" };
      default:
        return { icon: infoIcon, border: "border-r-sky-400" };
    }
  };
  const LottieHelper = Lottie;

  toast.custom(
    (t) => (
      <div
        className={`flex   md:w-96  justify-start relative right-0 left-0   items-center bg-white z-10   dark:bg-slate-700   rounded-lg px-3 py-2 text-black mx-auto    dark:border-0 
        border-r-8 dark:border-r-8 ${_findTypeData().border} shadow-lg
        transform-gpu translate-y-0 hover:translate-y-1  relative transition-all duration-500 ease-in-out 
        `}
        onClick={() => {
          toast.dismiss(t);
          typeof cb == "function" && cb();
        }}
      >
        <div className="w-14 h-14">
          <LottieHelper
            options={{ animationData: _findTypeData()?.icon, loop: true }}
          />
        </div>
        <div className={`mr-3   app-text  ${x_Iransans.className}  `}>
          <p className="font-light w-full text-[13px]  app-text  md:font-normal md:text-sm mx-2">
            {body}
          </p>
          {children}
        </div>
      </div>
    ),
    {
      id: type,
      duration: 8000,
      className: " left-0  md:left-4",
      position: isMobile ? "top-center" : "bottom-left",
    },
  );
};

export default Notify;
