"use client";

import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const InviePage = () => {
  const onShare = async (files: any) => {
    const title = "جایاب";
    const text = "شما را به جایاب دعوت میکنم";
    const url = window.origin;

    const shareDetails = { title, text, url };
    if (navigator.share) {
      try {
        await navigator.share(shareDetails).then(() => console.log("Your content was shared"));
      } catch (error) {}
    }
  };

  return (
    <div
      id="homeParent"
      className=" profile-container  !pb-36 items-center   !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-1 "
    >
      <div className=" w-full md:px-[30%]  mt-12   flex flex-col gap-4 ">
        <img src="/assets/images/shared/invite_image.png" />

        <p className="text-center">{_STRINGS.INVITE_TEXT}</p>

        <Button onClick={onShare} containerClass="w-full" width="w-full" title={_STRINGS.SHARE} />
      </div>
    </div>
  );
};

export default InviePage;
