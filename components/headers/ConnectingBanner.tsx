"use client";

import _STRINGS from "@/utils/LocalStrings";

const ConnectingBanner = () => {
  return (
    <div className="fixed left-0 right-0 mx-auto bottom-[5%] px-4 rounded-full bg-red-400 flex items-center w-fit z-50 justify-center  h-8 ">
      <p className="animate-pulse transition-all text-white   text-xs "> {_STRINGS.CONNECTING} ... </p>
    </div>
  );
};

export default ConnectingBanner;
