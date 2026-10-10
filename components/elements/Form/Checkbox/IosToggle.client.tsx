"use client";

import type { IosToggleProps } from "@/types/components/elements/form-legacy";

const IosToggle = ({
  index,
  toggle,
  onClick,
  disabled,
  disableTransform,
}: IosToggleProps) => {
  return (
    <div
      className={`relative border-2  !z-0 rounded-full w-[3.25rem] h-8 transition duration-200 ease-linear cursor-pointer ${
        toggle === true
          ? ` bg-emerald-500 border-emerald-500 `
          : " border-control bg-neutral-400/10"
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) onClick();
      }}
    >
      <label
        className={`absolute flex items-center justify-center end-0.5      mt-0.5 w-6 h-6 rounded-full transition ${
          disableTransform ? "" : "transform"
        } duration-100 ease-linear cursor-pointer ${
          toggle === true
            ? `translate-x-[80%]  bg-white ${"border-emrabg-emerald-500"}`
            : "translate-x-0 bg-neutral-400 border-line-strong"
        }`}
      ></label>
      <input
        type="checkbox"
        disabled={disabled}
        id={`toggle${index}`}
        name={`toggle${index}`}
        className="appearance-none cursor-pointer w-full h-full active:outline-none focus:outline-none"
      />
    </div>
  );
};

export default IosToggle;
