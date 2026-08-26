"use client";

import React from "react";
import Lottie from "react-lottie";
import LottieAnimation from "@/public/assets/lotties/404.json";
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
