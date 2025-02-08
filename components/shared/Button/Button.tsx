import React, { JSX, LegacyRef, ReactNode } from "react";
import BtnLoading from "./BtnLoading";
enum BtnVariants {
  "solid" = "btn-primary",
  "outline" = "btn-primary-outlined",
  "Faded" = "btn-primary-faded",
  "flat" = "btn-primary-flat",
}
enum BtnColors {
  "primary" = "bg-btnColor-primary",
  "danger" = "bg-btnColor-danger !text-btnColor-danger !border-btnColor-danger ",
  "light" = "bg-btnColor-light",
  "themeLight" = "bg-btnColor-themeLight",
}

type ButtonProps = {
  title?: ReactNode;
  variant?: keyof typeof BtnVariants;
  color?: keyof typeof BtnColors;
  containerClass?: string;
  roundedClass?: string;
  width?: string;
  icon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  loading?: boolean;
  disabled?: boolean;

  passRef?: LegacyRef<HTMLButtonElement>;
};

const Button = ({
  title,
  icon,
  endIcon,
  variant = "solid",
  color = "primary",
  containerClass,
  width = "w-fit",
  roundedClass = "rounded-10",
  disabled,
  loading,
  onClick,
  passRef,
}: ButtonProps): JSX.Element => {
  return (
    <div className={containerClass}>
      <button
        ref={passRef ? passRef : null}
        disabled={disabled || loading}
        type="button"
        className={`  flex items-center justify-center relative  transition-all font-medium text-base ${
          !disabled ? ` ${BtnVariants[variant]} ${BtnColors[color]}` : ""
        } ${"px-7 disabled:bg-gray-300 py-2.5"}  ${roundedClass} ${width} ${
          (disabled || loading) && "bg-neutral-200 dark:bg-zinc-400 border-gray-400 hover:ring-0"
        }`}
        onClick={typeof onClick == "function" ? onClick : void null}
      >
        {loading ? (
          <div className="flex w-full h-full items-center justify-center right-2 mb-1">
            <BtnLoading />
          </div>
        ) : (
          <>
            {!!icon && <span className="ml-1">{icon}</span>}
            {title}
            {!!endIcon && <span className="mr-1">{endIcon}</span>}
          </>
        )}
      </button>
    </div>
  );
};

export default Button;
