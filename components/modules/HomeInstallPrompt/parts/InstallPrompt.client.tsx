"use client";

import type { InstallPromptProps } from "@/types/components/modules/install-prompt";
import Button from "@elements/Button";

const InstallPromt = ({
  submitCallBack,
  cacelCallBack,
}: InstallPromptProps) => {
  return (
    <div
      className="fixed   right-0 left-0 bottom-0 app-text  w-full md:w-2/3 xl:w-1/2  mx-auto bg-white shadow-card rounded-t-lg px-3 pt-8 pb-6 gap-2 z-30 cart-shadow "
      // style={{ maxWidth: 450 }}
    >
      <div
        className="absolute cursor-pointer top-2 right-3 text-lg "
        onClick={() => cacelCallBack()}
      >
        &#x2715;
      </div>
      <div className="flex flex-col items-center gap-y-3">
        <p className="text-center">آیا مایل به نصب وب اپ جایاب هستید ؟</p>

        <div className="flex w-full px-8 gap-4">
          {" "}
          <Button
            title="بله"
            width="w-full !py-2"
            containerClass="w-full"
            roundedClass="rounded-lg"
            onClick={() => submitCallBack()}
          />{" "}
          <Button
            title="خیر"
            width="w-full"
            variant="Faded"
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
