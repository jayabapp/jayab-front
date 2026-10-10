"use client";

import type { NotifyProps } from "@/types/components/elements/toast";

import { isMobile } from "react-device-detect";
import { toast } from "sonner";

import successIcon from "@/public/assets/lotties/notif/Success.json";
import warningIcon from "@/public/assets/lotties/notif/Warning.json";
import errorIcon from "@/public/assets/lotties/notif/Error.json";
import infoIcon from "@/public/assets/lotties/notif/Info.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

const Notify = (props: NotifyProps) => {
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
        return { icon: successIcon, border: "border-s-status-success" };
      case "error":
        return { icon: errorIcon, border: "border-s-status-danger" };
      case "warn":
        return { icon: warningIcon, border: "border-s-status-warning" };
      case "info":
        return { icon: infoIcon, border: "border-s-link" };
      default:
        return { icon: infoIcon, border: "border-s-link" };
    }
  };
  const LottieHelper = Lottie;
  const rtl = document.documentElement.dir !== "ltr";

  toast.custom(
    (t) => (
      <div
        className={`relative start-0 end-0 z-10 mx-auto flex items-center justify-start rounded-lg border border-line border-s-8 bg-surface px-3 py-2 text-ink shadow-elevated transition-all duration-500 ease-in-out hover:translate-y-1 md:w-96 cursor-pointer ${_findTypeData().border}`}
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
        <div className="ms-3 app-text">
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
      // Desktop toasts sit at the end corner: bottom-left in RTL, bottom-right in LTR.
      className: rtl ? " left-0  md:left-4" : " right-0  md:right-4",
      position: isMobile ? "top-center" : rtl ? "bottom-left" : "bottom-right",
    },
  );
};

export default Notify;
