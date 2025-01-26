import React, { ReactNode } from "react";
import { toast } from "sonner";
import errorIcon from "@/public/assets/lotties/notif/Error.json";
import successIcon from "@/public/assets/lotties/notif/Success.json";
import warningIcon from "@/public/assets/lotties/notif/Warning.json";
import infoIcon from "@/public/assets/lotties/notif/Info.json";
import Lottie from "react-lottie";
import { Iransans_font } from "@/app/fonts/Iransans_font";
interface props {
  type?: "success" | "error" | "warn" | "info";
  title?: string;
  body?: string;
  cb?: () => void | null;
  children?: ReactNode;
}
const Notify = (props: props) => {
  const { type = "info", title, body, cb, children } = props || {};

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

  toast.custom(
    (t) => (
      <div
        className={`flex   md:w-96  justify-start relative right-0 left-0 items-center bg-slate-900 z-10   dark:bg-slate-700   rounded-lg px-3 py-2 text-black mx-auto    dark:border-0 
        border-r-8 dark:border-r-8 ${_findTypeData().border} shadow-lg
        transform-gpu translate-y-0 hover:translate-y-1  relative transition-all duration-500 ease-in-out 
        `}
        // ${t.visible ? "top-0" : "-top-96"}
        onClick={() => {
          toast.dismiss(t);
          typeof cb == "function" && cb();
        }}
      >
        <div className="w-14 h-14">
          <Lottie options={{ animationData: _findTypeData().icon, loop: true }} />
        </div>
        <div className={`mr-3   app-text  ${Iransans_font.className}  `}>
          {/* <h1 className="font-bold text-sm mx-2">{title}</h1> */}
          <p className="font-light w-full text-[13px]  text-white  md:font-normal md:text-sm mx-2">{body}</p>
          {children}
        </div>
        {/* <div className="absolute left-3 ">{closeIcon}</div> */}
      </div>
    ),
    { id: type, position: "bottom-center", duration: 5000 }
  );
};

export default Notify;
