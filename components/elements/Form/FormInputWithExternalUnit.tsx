
import type { ExternalUnitInputProps } from "@/types/components/elements/form";
import { memo, useRef } from "react";

import ContentImage from "@elements/Image/ContentImage";
import Num2persian from "@/helpers/Num2Persian";
import _STRINGS from "@/utils/LocalStrings";

const FormInputWithExternalUnit = ({ item, unit, value, onChangeText, errors, errorKey = "" }: ExternalUnitInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={item?.containerClass + " w-full  flex flex-col gap-2 items-start"}>
      <div className=" w-full flex gap-2 items-end">
        {" "}
        <div className="w-4/5">
          {item?.title ? (
            <label
              htmlFor={`input-${item?.id}`}
              className={`block  mb-3 ml-1 text-sm  pr-1 font-normal  ${
                item?.isMandatory && "after:content-['*'] after:mr-1 "
              } ${item?.titleClass || ""}`}
            >
              {item?.title}
              <span className="fs-8 text-danger-500">{item?.titleHint}</span>
            </label>
          ) : (
            <></>
          )}

          <input
            onClick={item?.onClick}
            type={item?.keyboard == "password" ? "password" : item?.keyboard == "number" ? "tel" : "text"}
            ref={inputRef}
            inputMode={item?.keyboard == "number" ? "tel" : "text"}
            pattern={item?.keyboard == "number" ? "[0-9]*" : ""}
            className={`${!!item?.iconUrl ? " !pr-[3rem]" : ""}  ${!!item?.iconEndUrl ? " !pl-10" : ""} ${
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
              else if (!isNaN(Number(v.target.value)) || item?.convertToText) onChangeText(v.target.value);
              if (inputRef.current && item?.maxLength && v.target.value.length >= item?.maxLength)
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
            <ContentImage alt="" height={24} width={24}
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
            <ContentImage alt="" height={24} width={24}
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
            <div id={`${item?.id}`} className={`text-xs font-light text-neutral-400 mt-1 mr-5 `}>
              {item?.hint}
            </div>
          )}
        </div>
        <div className=" border  bg-neutral-50 text-neutral-400 w-1/5 h-[2.875rem] rounded-10   flex items-center justify-center  text-sm font-medium ">
          {unit || ""}
        </div>{" "}
      </div>{" "}
      {!!item?.convertToText && !!value && (
        <div id={`${item?.id}`} className="text-xs pr-1  text-brand-600    ">
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
export default memo(FormInputWithExternalUnit, isEqualProps);
