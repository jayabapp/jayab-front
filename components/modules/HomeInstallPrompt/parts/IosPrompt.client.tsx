"use client";

import { useTranslations } from "next-intl";

import type { ReactNode } from "react";

import Button from "@elements/Button";
import Image from "next/image";

const bold = (chunks: ReactNode) => (
  <strong className="font-medium">{chunks}</strong>
);

const IosPrompt = ({ callBack }: { callBack: () => void | null }) => {
  const t = useTranslations("common");
  const tr = useTranslations();

  return (
    <div
      onClick={() => callBack()}
      className="fixed cursor-pointer pt-16 !bg-transparent right-0 left-0 backdrop-brightness-50 bottom-0 app-text w-full mx-auto backdrop-blur-sm  custom-prompt-shadow  rounded-t-lg px-3  pb-6  z-30 cart-shadow  h-full flex flex-col gap-16"
    >
      <div className="relative flex justify-center items-center w-full h-full">
        <div
          style={{ transform: "translate(50%, 50%) rotate(135deg)" }}
          className="bg-surface absolute w-8 h-8 rotate-45 left-[50%] right-[50%] bottom-4"
        ></div>
        <div
          onClick={(e) => e?.stopPropagation()}
          className="flex bg-surface p-6 rounded-2xl flex-col gap-4 justify-center items-center absolute bottom-2"
        >
          <div className="flex flex-col items-center justify-center gap-8">
            <Image
              alt=""
              width={128}
              height={128}
              className="w-32 aspect-square"
              src="/assets/icons/logo/logo.svg"
            />
          </div>
          <div className="py-8 px-4 border-t font-light  flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <Image
                alt=""
                width={24}
                height={24}
                src="/assets/icons/install_prompt/share.svg"
              />{" "}
              <p>{tr.rich("content.iosStep1", { b: bold })}</p>
            </div>
            <div className="flex items-start gap-4">
              <Image
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
                src="/assets/icons/install_prompt/blue_add.svg"
              />{" "}
              <p>{tr.rich("content.iosStep2", { b: bold })}</p>
            </div>
            <div className="flex items-start gap-4">
              <p className="text-link font-normal w-6 h-6">Add</p>
              <p>{tr.rich("content.iosStep3", { b: bold })}</p>
            </div>
          </div>
          <Button
            width="w-full"
            title={t("understood")}
            containerClass="w-full"
            onClick={() => callBack()}
          />
        </div>
      </div>
    </div>
  );
};

export default IosPrompt;
