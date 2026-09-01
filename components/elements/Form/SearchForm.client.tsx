"use client";

import type { SearchFormProps } from "@/types/components/elements/form-legacy";
import { p2e } from "@/helpers/NumberConverter";
import { ContentImage } from "@elements/Image";
import { useRef, memo } from "react";

import Num2persian from "@/helpers/Num2Persian";
import _STRINGS from "@/utils/LocalStrings";
const FormInput = ({
  item,
  value,
  errors,
  onChangeText,
  errorKey = "",
}: SearchFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={item?.containerClass + " mb-4"}>
      <input
        onClick={item?.onClick ? item.onClick : () => null}
        type={
          item?.keyboard == "password"
            ? "password"
            : item?.keyboard == "number"
              ? "tel"
              : "text"
        }
        ref={inputRef}
        inputMode={item?.keyboard == "number" ? "tel" : "text"}
        pattern={item?.keyboard == "number" ? "[0-9]*" : ""}
        className={`${!!item?.iconUrl ? " !pr-[3rem]" : ""}  ${
          !!item?.iconEndUrl ? " !pl-10" : ""
        } ${
          item?.direction ? item?.direction : "rtl"
        }   bg-neutral-50    !text-base   ltr  text-right form-control  font-normal border focus:border-brand-600  py-4 px-4 w-full rounded-10 placeholder:text-neutral-400 placeholder:text-right   placeholder:font-normal placeholder:text-sm placeholder:opacity-70   ${
          item?.inputClass
        } ${
          item?.disableHover
            ? ""
            : !!errors && !!errors[errorKey]
              ? "border-red-100"
              : " hover:border-neutral-300 focus:border-brand-600/30"
        } `}
        id={`input-${item?.id}`}
        placeholder={item?.placeholder || item?.title}
        onChange={(v) => {
          if (item?.keyboard != "number") onChangeText(v.target.value);
          else if (!isNaN(Number(p2e(v.target.value))))
            onChangeText(v.target.value);
          if (
            inputRef.current &&
            item?.maxLength &&
            v.target.value.length >= item?.maxLength
          )
            inputRef.current.blur();
        }}
        maxLength={item?.maxLength || 256}
        disabled={item?.disabled}
        value={value}
        autoFocus={item?.autoFocus}
        onFocus={(event) => {
          event.target.setAttribute("autocomplete", "off");
        }}
      />

      {!!item?.iconUrl && (
        <ContentImage
          alt=""
          width={16}
          height={16}
          className={`absolute ${
            item?.title ? "top-[61%]" : "top-[32%]"
          } w-4 aspect-square right-4 ${item?.iconUrlClassName} ${
            item?.iconFunc ? "cursor-pointer" : ""
          }`}
          onClick={() => {
            if (item?.iconFunc) {
              item?.iconFunc();
            }
          }}
          src={"/assets/icons/edit/blue_edit_pen.svg"}
        />
      )}
      {!!item?.iconEndUrl && (
        <ContentImage
          alt=""
          width={20}
          height={20}
          className={`absolute top-[28%] w-5 aspect-square left-4 ${
            item?.iconEndUrlClassName
          } ${item?.iconEndFunc ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (item?.iconEndFunc) {
              item?.iconEndFunc();
            }
          }}
          src={`${item?.iconEndUrl}`}
        />
      )}
      {!!item?.maxLengthShower && (
        <p className={`absolute top-[0.75rem] w-5 aspect-square left-8 `}>
          {`${value}`?.split("").length}/{item?.maxLength}
        </p>
      )}
      {!!item?.extraElement && <span>{item?.extraElement}</span>}
      {!!item?.hint && (
        <div
          id={`${item?.id}`}
          className={`text-xs font-light text-neutral-400 mt-1 mr-5 `}
        >
          {item?.hint}
        </div>
      )}

      {!!item?.convertToText && !!value && (
        <div id={`${item?.id}`} className="text-sm text-primary mt-1">
          {Num2persian(value)} {_STRINGS?.TOMAN}
        </div>
      )}
    </div>
  );
};

function isEqualProps(prevProps: any, nextProps: any) {
  return (
    prevProps.value == nextProps.value &&
    prevProps?.item?.keyboard == nextProps?.item?.keyboard &&
    prevProps?.item?.iconEndUrl == nextProps?.item?.iconEndUrl &&
    prevProps?.item?.disabled == nextProps?.item?.disabled &&
    prevProps?.item?.iconEndFunc == nextProps?.item?.iconEndFunc
  );
}
export default memo(FormInput, isEqualProps);
