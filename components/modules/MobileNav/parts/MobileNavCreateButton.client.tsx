"use client";

import type { MobileNavCreateButtonProps } from "@/types/components/modules/mobile-nav";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";

const MobileNavCreateButton = ({ onSelect }: MobileNavCreateButtonProps) => (
  <button
    type="button"
    onClick={onSelect}
    title={_STRINGS.CREATE_ADD}
    className="flex flex-col justify-between shrink-0 w-24 relative"
  >
    <ContentImage
      alt=""
      width={96}
      height={96}
      className="-bottom-[2.1rem] h-24 absolute w-24"
      src="/assets/icons/navbar/footer_bump.svg"
    />

    <span className="w-full h-full aspect-square absolute -top-[1.85rem] left-0 right-0 mx-auto rounded-full bg-transparent flex items-center justify-center">
      <span className="footer-plus-shadow flex items-center justify-center size-[3.250rem] rounded-full border border-brand-300">
        <ContentImage
          alt=""
          width={14}
          height={14}
          className="size-[0.875rem]"
          src="/assets/icons/navbar/footer_big_plus.svg"
        />
      </span>
    </span>

    <p className="truncate text-xs absolute -bottom-[1.375rem] right-0 left-0 mx-auto md:text-base text-center text-brand-600 select-none opacity-60 grayscale brightness-90">
      {_STRINGS.CREATE_ADD}
    </p>
  </button>
);

export default MobileNavCreateButton;
