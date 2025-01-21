"use client";

import React from "react";
import Lottie from "react-lottie";
import LottieAnimation from "@/public/assets/lotties/location.json";

const LocationAnime = ({ margin }: { margin?: string }) => {
  return (
    <div
      className="absolute w-12 cursor-pointer aspect-square top-1/2 left-1/2  "
      style={{ transform: "translate(-50%,-50%)" }}
    >
      <Lottie options={{ animationData: LottieAnimation, loop: true }} />
    </div>
  );
};

export default LocationAnime;
