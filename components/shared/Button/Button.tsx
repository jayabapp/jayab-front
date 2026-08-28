import React, { JSX, LegacyRef, ReactNode } from "react";
import BtnLoading from "./BtnLoading";
enum BtnVariants {
  "solid" = "btn-primary",
  "outline" = "btn-brand-outlined",
  "Faded" = "btn-brand-faded",
  "flat" = "btn-brand-flat",
}
enum BtnColors {
  "primary" = "bg-brand-600  !ring-brand-600/50",
  "danger" = "bg-danger-500  !ring-danger-500/50 !text-danger-500 !border-danger-500 ",
  "light" = "bg-neutral-200/75 !ring-neutral-200/75/50 ",
  "themeLight" = "bg-brand-100  !ring-brand-100/50 ",
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
        className={` active:ring-4  flex items-center justify-center relative  transition-all font-medium text-base ${
          !disabled ? ` ${BtnVariants[variant]} ${BtnColors[color]}` : ""
        } ${"px-7 disabled:bg-neutral-300 py-2.5"}  ${roundedClass} ${width} ${
          (disabled || loading) && "bg-neutral-200  border-neutral-400 hover:ring-0"
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
