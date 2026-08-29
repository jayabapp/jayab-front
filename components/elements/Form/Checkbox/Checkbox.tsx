import type { CheckboxProps } from "@/types/components/elements/form";
import type { JSX } from "react";

const Checkbox = ({
  title,
  isChecked,
  onSelect,
  containerClass,
  titleClass,
  rounded = "rounded-md",
  disabled,
}: CheckboxProps): JSX.Element => {
  return (
    <div className={containerClass ? containerClass : "my-2.5"}>
      <button
        aria-checked={isChecked}
        className={`flex  select-none  transition-all !shrink-0 !grow-0   cursor-pointer ${
          disabled ? "grayscale" : ""
        }`}
        disabled={disabled}
        onClick={onSelect}
        role="checkbox"
        type="button"
      >
        <div
          className={`${
            !!isChecked ? "bg-brand-600" : ""
          }  w-5 flex transition-all items-center justify-center h-5 relative ${rounded} !shrink-0 !grow-0 border-2   ${
            isChecked ? "bg-brand-600  border-transparent " : "  border-neutral-300 "
          } `}
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 9.4L0 5.4L1.4 4L4 6.6L10.6 0L12 1.4L4 9.4Z" fill="white" />
          </svg>
        </div>
        {title ? (
          <p className={`mx-2 transition-all text-sm ${isChecked ? "font-medium" : ""} ${titleClass} `}>{title}</p>
        ) : (
          ""
        )}
      </button>
    </div>
  );
};

export default Checkbox;
