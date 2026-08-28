"use client";

import { ReactNode } from "react";
import { isMobile } from "react-device-detect";
import { toast } from "sonner";

import successIcon from "@/public/assets/lotties/notif/Success.json";
import warningIcon from "@/public/assets/lotties/notif/Warning.json";
import errorIcon from "@/public/assets/lotties/notif/Error.json";
import infoIcon from "@/public/assets/lotties/notif/Info.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

type TNotifyProps = {
  body?: string;
  title?: string;
  loop?: boolean;
  duration?: number;
  id?: string | number;
  children?: ReactNode;
  cb?: () => void | null;
  type?: "success" | "error" | "warn" | "info";
};

const Notify = (props: TNotifyProps) => {
  const {
    cb,
    body,
    children,
    loop = true,
    type = "info",
    duration = 8000,
    id = type,
  } = props || {};

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
        className={`relative right-0 left-0 z-10 mx-auto flex items-center justify-start rounded-lg border-r-8 bg-white px-3 py-2 text-black shadow-lg transition-all duration-500 ease-in-out hover:translate-y-1 md:w-96 ${_findTypeData().border}`}
        onClick={() => {
          toast.dismiss(t);
          typeof cb == "function" && cb();
        }}
      >
        <div className="w-14 h-14">
          <LottieHelper
            options={{ animationData: _findTypeData()?.icon, loop }}
          />
        </div>
        <div className="mr-3 app-text">
          <p className="font-light w-full text-[13px]  app-text  md:font-normal md:text-sm mx-2">
            {body}
          </p>
          {children}
        </div>
      </div>
    ),
    {
      id,
      duration,
      className: " left-0  md:left-4",
      position: isMobile ? "top-center" : "bottom-left",
    },
  );
};

export default Notify;
