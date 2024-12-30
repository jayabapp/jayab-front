"use client";

import React from "react";
import Lottie from "react-lottie";
import LottieAnimation from "@/public/assets/lotties/rotate_phone.json";
import _STRINGS from "@/utils/LocalStrings";
const RotatePhone = ({ margin }: { margin?: string }) => {
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center mx-auto ">
      <div className="w-1/2 md:w-1/4">
        <Lottie options={{ animationData: LottieAnimation, loop: true }} />
      </div>
      <p>{_STRINGS?.ROTATE_PHONE}</p>
    </div>
  );
};

export default RotatePhone;
