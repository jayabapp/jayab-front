import { JSX, ReactNode } from "react";
import { color } from "framer-motion";

type CheckboxProps = {
  title?: ReactNode;
  isChecked: boolean;
  onSelect: () => void;
  containerClass?: string;
  rounded?: string;
  customeFillImage?: string;
  disabled?: boolean;
};
const Checkbox = ({
  title,
  isChecked,
  onSelect,
  containerClass,
  rounded = "rounded-md",
  customeFillImage,
  disabled,
}: CheckboxProps): JSX.Element => {
  return (
    <div className={containerClass ? containerClass : "my-2.5"}>
      <div
        className={`flex  select-none  transition-all !shrink-0 !grow-0   cursor-pointer ${
          disabled ? "grayscale" : ""
        }`}
        onClick={() => {
          if (disabled) return;
          onSelect();
        }}
      >
        <div
          className={`${
            !!isChecked ? "bg-primary-700" : ""
          }  w-5 flex transition-all items-center justify-center h-5 relative ${rounded} !shrink-0 !grow-0 border-2   ${
            isChecked ? "bg-primary-700  border-transparent " : "  border-gray-300 "
          } `}
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 9.4L0 5.4L1.4 4L4 6.6L10.6 0L12 1.4L4 9.4Z" fill="white" />
          </svg>
        </div>
        {title ? <p className={`mx-2 transition-all text-sm ${isChecked ? "font-medium" : ""} `}>{title}</p> : ""}
      </div>
    </div>
  );
};

export default Checkbox;
