"use client";

import React from "react";
import Lottie from "react-lottie";
import LottieAnimation from "@/public/assets/lotties/loading.json";
const LottieLoading = ({ margin }: { margin?: string }) => {
  return (
    <div className={`flex flex-col items-center ${margin || ""}`}>
      <div className="w-1/3 dark:invert md:w-1/5">
        <Lottie options={{ animationData: LottieAnimation, loop: true }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-3 animate-pulse mb-4 ">در حال بارگذاری ...</p>
    </div>
  );
};

export default LottieLoading;
