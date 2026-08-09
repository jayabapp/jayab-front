"use client";

import LottieAnimation from "@/public/assets/lotties/loading.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
  loading: () => <div className="w-full aspect-square" />,
});
const LottieLoading = ({ margin }: { margin?: string }) => {
  return (
    <div className={`flex flex-col items-center ${margin || ""}`}>
      <div className="w-[100px] dark:invert md:w-[120px]">
        <Lottie options={{ animationData: LottieAnimation, loop: true }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-3 animate-pulse mb-4 ">
        در حال بارگذاری ...
      </p>
    </div>
  );
};

export default LottieLoading;
