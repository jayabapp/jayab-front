"use client";

import LottieAnimation from "@/public/assets/lotties/404.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
  loading: () => <div className="w-full aspect-square" />,
});
const NotFOund = () => {
  return (
    <div className={`container flex-col items-center justify-center `}>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-3/4 md:w-1/2">
          <Lottie options={{ animationData: LottieAnimation, loop: true }} />
        </div>
      </div>
    </div>
  );
};

export default NotFOund;
