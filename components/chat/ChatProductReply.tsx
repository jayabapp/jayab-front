import React from "react";

import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";

export interface ChatFooterTypes {
  product?: any | null;
  cancleButton?: () => void | null;
}

const ChatProductReply = ({ product, cancleButton }: ChatFooterTypes) => {
  return (
    <div className="flex items-center bg-neutral-100 gap-2 border-b p-4 relative">
      {product?.image_location ? (
        <img src={NEW_IMAGE_URL(product?.image_location)} className="rounded-md object-cover w-11 aspect-square" />
      ) : (
        <></>
      )}
      <div className="flex flex-col items-center gap-2 justify-between">
        <p className="text-xs font-medium">{product?.title}</p>
        <p className="text-xs">
          {"_STRINGS?.A17"} {product?.id}
        </p>
      </div>
      <img
        onClick={() => {
          cancleButton ? cancleButton() : null;
        }}
        className=" absolute left-4 top-4  w-4 aspect-square"
        src="/assets/icons/home/close.svg"
      />
    </div>
  );
};

export default ChatProductReply;
