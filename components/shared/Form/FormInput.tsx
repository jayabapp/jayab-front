import { IMAGE_URL } from "@/utils/urls";

import React, { useRef, memo, ReactNode } from "react";
import Num2persian from "../../../helpers/Num2Persian";
import _STRINGS from "../../../utils/LocalStrings";
import { p2e } from "@/helpers/NumberConverter";
export interface props {
  value: string | number | undefined;
  errorKey?: string;
  onChangeText: (e: any) => void | null;

  errors?: { [key: string]: string[] };
  item?: {
    containerClass?: string;
    title?: string;
    iconUrl?: string;
    iconUrlClassName?: string;
    iconEndUrl?: string;
    iconEndUrlClassName?: string;
    iconFunc?: () => void | null;
    iconEndFunc?: () => void | null;
    titleClass?: string;
    hint?: string;
    direction?: string;
    placeholder?: string;
    titleHint?: string;
    inputClass?: string;
    keyboard?: string;
    id?: number;
    maxLength?: number;
    isMandatory?: boolean;
    disableHover?: boolean;
    maxLengthShower?: boolean;
    autoFocus?: boolean;
    disabled?: boolean;
    extraElement?: ReactNode;
    convertToText?: boolean;
    onClick?: () => void | null;
  };
}
const FormInput = ({ item, value, onChangeText, errors, errorKey = "" }: props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={item?.containerClass + " mb-4 relative"}>
      {item?.title ? (
        <label
          htmlFor={`input-${item?.id}`}
          className={`block  mb-3 ml-1 text-sm  pr-1 font-normal  ${
            item?.isMandatory && "after:content-['*'] after:mr-1 after:text-red-500"
          } ${item?.titleClass || ""}`}
        >
          {item?.title}
          <span className="fs-8 text-danger">{item?.titleHint}</span>
        </label>
      ) : (
        <></>
      )}

      <input
        onClick={item?.onClick ? item?.onClick : (e) => null}
        type={item?.keyboard == "password" ? "password" : item?.keyboard == "number" ? "tel" : "text"}
        ref={inputRef}
        inputMode={item?.keyboard == "number" ? "tel" : "text"}
        pattern={item?.keyboard == "number" ? "[0-9]*" : ""}
        className={`${!!item?.iconUrl ? " !pr-[3rem]" : ""}  ${!!item?.iconEndUrl ? " !pl-10" : ""} ${
          item?.direction ? item?.direction : "rtl"
        }   bg-gray-50    !text-base   ltr  text-right form-control  font-normal border focus:border-primary-700  py-4 px-4 w-full rounded-10 placeholder:text-gray-400 placeholder:text-right   placeholder:font-normal placeholder:text-sm placeholder:opacity-70   ${
          item?.inputClass
        } ${
          item?.disableHover
            ? ""
            : !!errors && !!errors[errorKey]
            ? "border-red-100"
            : " hover:border-gray-1150 focus:border-primary-700/30"
        } `}
        id={`input-${item?.id}`}
        placeholder={item?.placeholder || item?.title}
        onChange={(v) => {
          if (item?.keyboard != "number") onChangeText(v.target.value);
          else if (!isNaN(Number(p2e(v.target.value)))) onChangeText(v.target.value);
          if (inputRef.current && item?.maxLength && v.target.value.length >= item?.maxLength) inputRef.current.blur();
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
        <img
          className={`absolute ${item?.title ? "top-[61%]" : "top-[32%]"} w-4 aspect-square right-4 ${
            item?.iconUrlClassName
          } ${item?.iconFunc ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (item?.iconFunc) {
              item?.iconFunc();
            }
          }}
          src={`${item?.iconUrl}`}
        />
      )}
      {!!item?.iconEndUrl && (
        <img
          className={`absolute top-[28%] w-5 aspect-square left-4 ${item?.iconEndUrlClassName} ${
            item?.iconEndFunc ? "cursor-pointer" : ""
          }`}
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
        <div id={`${item?.id}`} className={`text-xs font-light text-gray-400 mt-1 mr-5 `}>
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
