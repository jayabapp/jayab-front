import { BtnColors, BtnVariants } from "@/types/components/elements/button";
import type { ButtonProps } from "@/types/components/elements/button";
import type { JSX } from "react";

import BtnLoading from "./BtnLoading";

const Button = ({
  title,
  icon,
  endIcon,
  variant = "solid",
  color = "primary",
  containerClass,
  btnClass = "",
  width = "w-fit",
  roundedClass = "rounded-10",
  disabled,
  loading,
  loadingIndicator,
  preserveStyleWhileLoading = false,
  onClick,
  passRef,
}: ButtonProps): JSX.Element => {
  return (
    <div className={containerClass}>
      <button
        ref={passRef ? passRef : null}
        aria-busy={loading || undefined}
        aria-label={loading && typeof title === "string" ? title : undefined}
        disabled={disabled || loading}
        type="button"
        className={` active:ring-4  flex items-center justify-center relative  transition-all font-medium text-base ${
          !disabled ? ` ${BtnVariants[variant]} ${BtnColors[color]}` : ""
        } ${"px-7 disabled:bg-neutral-300 py-2.5"}  ${roundedClass} ${width} ${btnClass} ${
          (disabled || loading) &&
          !preserveStyleWhileLoading &&
          "bg-neutral-200 border-neutral-400 hover:ring-0"
        } ${loading && preserveStyleWhileLoading ? "btn-loading-preserve" : ""
        }`}
        onClick={typeof onClick == "function" ? onClick : void null}
      >
        {loading ? (
          <div className="flex w-full h-full items-center justify-center right-2 mb-1">
            {loadingIndicator ?? <BtnLoading />}
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
