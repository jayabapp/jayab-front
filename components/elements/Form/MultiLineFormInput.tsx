
import type { MultiLineFormInputProps } from "@/types/components/elements/form";
import { memo } from "react";

import ContentImage from "@elements/Image/ContentImage";

const FormInput = ({
  item,
  value,
  onChangeText,
  errors,
  errorKey = "",
}: MultiLineFormInputProps) => {
  return (
    <div className={item?.containerClass + " "}>
      {item?.title ? (
        <label
          htmlFor={`input-${item?.id}`}
          className={`block  mb-3 ml-1 text-sm   pr-1 font-normal  ${
            item?.isMandatory && "after:content-['*'] after:mr-1 "
          } ${item?.titleClass || ""}`}
        >
          {item?.title}
          <span className="fs-8 text-danger-500">{item?.titleHint}</span>
        </label>
      ) : (
        <></>
      )}
      <textarea
        rows={item?.rows || 3}
        className={`${!!item?.iconUrl ? " !pl-10" : ""}  ${!!item?.iconEndUrl ? " !pr-10" : ""} ${
          item?.direction ? item?.direction : "rtl"
        }  text-right form-control !transform-none text-base font-normal  bg-white     border  focus:border-brand-600/30 py-4 px-4 w-full rounded-10 placeholder:text-neutral-400 placeholder:text-right   placeholder:font-normal placeholder:text-sm placeholder:opacity-70   ${
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
        onChange={(v) => onChangeText(v.target.value)}
        maxLength={item?.maxLength || 512}
        disabled={item?.disabled}
        value={value}
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
        <div
          id={`${item?.id}`}
          className={`text-xs font-light text-neutral-400 mt-1 mr-5 `}
        >
          {item?.hint}
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
