"use client";

import { useEffect, useState } from "react";

import LottieAnimationDark from "../../../public/assets/lotties/emptyDark.json";
import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
  loading: () => <div className="w-1/2 aspect-square" />,
});

const EmptyList = ({ title }: { title?: string }) => {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const temp = localStorage.getItem("theme");
    if (temp) setTheme(temp);
  }, []);
  return (
    <div className="flex scale-75  justify-center mt-5 py-5  items-center">
      <div className="flex   flex-col">
        <Lottie
          options={{
            animationData: LottieAnimationDark,
            loop: false,
          }}
          width={"50%"}
        />

        <p className="text-center -mt-2 dark:text-zinc-400 text-gray-300 ">
          {title || _STRINGS?.EMPTY_LIST}
        </p>
      </div>
    </div>
  );
};

export default EmptyList;
