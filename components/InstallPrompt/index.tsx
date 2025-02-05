"use client";

import React from "react";
import Button from "../shared/Button/Button";

const InstallPromt = ({
  submitCallBack,
  cacelCallBack,
}: {
  submitCallBack: () => void | null;
  cacelCallBack: () => void | null;
}) => {
  return (
    <div
      className="fixed   right-0 left-0 bottom-0 app-text  w-full md:w-2/3 xl:w-1/2  mx-auto bg-white shadow-card rounded-t-lg px-3 pt-8 pb-6 gap-2 z-30 cart-shadow "
      // style={{ maxWidth: 450 }}
    >
      <div className="absolute cursor-pointer top-2 right-3 text-lg " onClick={() => cacelCallBack()}>
        &#x2715;
      </div>
      <div className="flex flex-col items-center gap-y-3">
        <p className="text-center">آیا مایل به نصب وب اپ جایاب هستید ؟</p>

        <div className="flex w-full px-8 gap-4">
          {" "}
          <Button
            title="بله"
            roundedClass="rounded-lg"
            containerClass="w-full"
            width="w-full !py-2"
            onClick={() => submitCallBack()}
          />{" "}
          <Button
            containerClass="w-full"
            width="w-full "
            roundedClass="rounded-lg"
            variant="Faded"
            title="خیر"
            onClick={() => cacelCallBack()}
          />
        </div>
      </div>
    </div>
  );
};

export default InstallPromt;
