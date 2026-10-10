"use client";

import { useTranslations } from "next-intl";

import type { InstallPromptProps } from "@/types/components/modules/install-prompt";

import Button from "@elements/Button";

const InstallPromt = ({
  submitCallBack,
  cacelCallBack,
}: InstallPromptProps) => {
  const t = useTranslations();

  return (
    <div
      className="fixed   right-0 left-0 bottom-0 app-text  w-full md:w-2/3 xl:w-1/2  mx-auto bg-surface shadow-surface rounded-t-lg px-3 pt-8 pb-6 gap-2 z-30 cart-shadow "
    >
      <div
        onClick={() => cacelCallBack()}
        className="absolute cursor-pointer top-2 right-3 text-lg "
      >
        &#x2715;
      </div>
      <div className="flex flex-col items-center gap-y-3">
        <p className="text-center">{t("content.installPrompt")}</p>

        <div className="flex w-full px-8 gap-4">
          <Button
            width="w-full !py-2"
            title={t("common.yes")}
            containerClass="w-full"
            roundedClass="rounded-lg"
            onClick={() => submitCallBack()}
          />
          <Button
            width="w-full"
            variant="Faded"
            title={t("common.no")}
            containerClass="w-full"
            roundedClass="rounded-lg"
            onClick={() => cacelCallBack()}
          />
        </div>
      </div>
    </div>
  );
};

export default InstallPromt;
