"use client";

import React from "react";
import Button from "../shared/Button/Button";

const IosPrompt = ({ callBack }: { callBack: () => void | null }) => {
  return (
    <div
      onClick={(e) => {
        callBack();
      }}
      className="fixed pt-16 !bg-transparent app-size right-0 left-0 backdrop-brightness-50 bottom-0 app-text w-full mx-auto backdrop-blur-sm dark:bg-slate-800/40 custom-prompt-shadow  rounded-t-lg px-3  pb-6  z-30 cart-shadow  h-full flex flex-col gap-16"
    >
      <div className="relative flex justify-center items-center w-full h-full">
        <div
          className="bg-white absolute w-8 h-8 rotate-45 left-[50%] right-[50%] bottom-4"
          style={{ transform: "translate(50%, 50%) rotate(135deg)" }}
        ></div>
        <div
          onClick={(e) => e?.stopPropagation()}
          className="flex bg-white p-6 rounded-2xl flex-col gap-4 justify-center items-center absolute bottom-2"
        >
          {" "}
          <div className="flex flex-col items-center justify-center gap-8">
            <img src={"/assets/icons/logo/logo.svg"} className="w-32 aspect-square" />
            {/* <p className="text-center px-6 ">{_STRINGS?.LOGO}</p> */}
          </div>
          <div className="py-8 px-4 border-t font-light  flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <img src="/assets/icons/install_prompt/share.svg" />{" "}
              <p>
                1- در نوار پایین روی دکمه <strong className="font-medium">Share</strong> بزنید.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <img src="/assets/icons/install_prompt/blue_add.svg" className="w-6 h-6" />{" "}
              <p>
                2- در منوی باز شده و در قسمت پایین , گزینه <strong className="font-medium">Add to Home Screen</strong>{" "}
                را انتخاب کنید.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <p className="text-[#351CCD] font-normal w-6 h-6">Add</p>
              <p>
                3- در مرحله بعد در قسمت بالا روی <strong className="font-medium">Share</strong> بزنید.
              </p>
            </div>
          </div>
          <Button onClick={() => callBack()} title="متوجه شدم" containerClass="w-full" width="w-full" />
        </div>
      </div>
    </div>
  );
};

export default IosPrompt;
