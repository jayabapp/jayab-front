import React from "react";

function IosToggle({
  toggle,
  onClick,
  index,
  disabled,

  disableTransform,
}: {
  onClick: () => void | null;
  toggle: boolean;
  index: number;
  disabled?: boolean;

  disableTransform?: boolean;
}) {
  return (
    <div
      className={`relative border-2  !z-0 rounded-full w-[3.25rem] h-8 transition duration-200 ease-linear cursor-pointer ${
        toggle === true ? ` bg-emerald-500 border-emerald-500 ` : " border-gray-400 bg-gray-400/10"
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) {
        } else onClick();
      }}
    >
      <label
        // for={`toggle${index}`}
        className={`absolute flex items-center justify-center left-0.5   dark:bg-zinc-700   mt-0.5 w-6 h-6 rounded-full transition ${
          disableTransform ? "" : "transform"
        } duration-100 ease-linear cursor-pointer ${
          toggle === true
            ? `translate-x-[80%]  bg-white ${"border-emrabg-emerald-500"}`
            : "translate-x-0 bg-gray-400 border-gray-300"
        }`}
      >
        {/* {!!toggle ? (
          <CheckIcon strokeWidth={3} className="w-3 h-4 text-emerald-500" />
        ) : (
          <XMarkIcon className="w-4 h-4 text-white" />
        )} */}
      </label>
      <input
        type="checkbox"
        id={`toggle${index}`}
        name={`toggle${index}`}
        className="appearance-none cursor-pointer w-full h-full active:outline-none focus:outline-none"
        disabled={disabled}
      />
    </div>
  );
}

export default IosToggle;
