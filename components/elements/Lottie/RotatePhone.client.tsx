"use client";

import { useTranslations } from "next-intl";

import LottieAnimation from "@/public/assets/lotties/rotate_phone.json";
import Lottie from "react-lottie";

const RotatePhone = () => {
  const t = useTranslations("common");

  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center mx-auto ">
      <div className="w-1/2 md:w-1/4">
        <Lottie options={{ animationData: LottieAnimation, loop: true }} />
      </div>
      <p>{t("rotatePhone")}</p>
    </div>
  );
};

export default RotatePhone;
