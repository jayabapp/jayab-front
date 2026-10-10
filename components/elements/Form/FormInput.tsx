"use client";

import { useAmountInWords } from "@hooks/useAmountInWords";
import { useTranslations } from "next-intl";
import { memo, useRef } from "react";
import { useDir } from "@hooks/useDir";
import { p2e } from "@/helpers/NumberConverter";

import type { FormInputProps } from "@/types/components/elements/form";

import ContentImage from "@elements/Image/ContentImage";

const FormInput = ({
  item,
  value,
  errors,
  onChangeText,
  errorKey = "",
}: FormInputProps) => {
  const t = useTranslations("common");
  const dir = useDir();
  const amountInWords = useAmountInWords();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={item?.containerClass + ""}>
      {item?.title ? (
        <label
          htmlFor={`input-${item?.id}`}
          className={`block  mb-3 me-1 text-sm  ps-1 font-normal  ${
            item?.isMandatory && "after:content-['*'] after:ms-1 "
          } ${item?.titleClass || ""}`}
        >
          {item?.title}
          <span className="fs-8 text-status-danger">{item?.titleHint}</span>
        </label>
      ) : (
        <></>
      )}

      <input
        onClick={item?.onClick}
        type={
          item?.keyboard == "password"
            ? "password"
            : item?.keyboard == "number"
              ? "tel"
              : "text"
        }
        ref={item?.passedRef || inputRef}
        inputMode={item?.keyboard == "number" ? "tel" : "text"}
        pattern={item?.keyboard == "number" ? "[0-9]*" : ""}
        className={`${!!item?.iconUrl ? " !ps-[3rem]" : ""}  ${!!item?.iconEndUrl ? " !pe-10" : ""} ${
          item?.direction ? item?.direction : dir
        }   bg-surface-muted    !text-base   ltr  text-start form-control  font-normal border border-control focus:border-action  py-4 px-4 w-full rounded-10 placeholder:text-ink-subtle placeholder:text-start   placeholder:font-normal placeholder:text-sm placeholder:opacity-70   ${
          item?.inputClass
        } ${
          item?.disableHover
            ? ""
            : !!errors && !!errors[errorKey]
              ? "border-status-danger-line"
              : " hover:border-ink-muted focus:border-action/30"
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
          height={24}
          width={24}
          alt="before_icon"
          className={`absolute ${item?.title ? "top-[61%]" : "top-[32%]"} w-4 aspect-square start-4 ${
            item?.iconUrlClassName
          } ${item?.iconFunc ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (item?.iconFunc) item?.iconFunc();
          }}
          src={`${item?.iconUrl}`}
        />
      )}
      {!!item?.iconEndUrl && (
        <ContentImage
          height={24}
          width={24}
          alt="after_icon"
          className={`absolute top-[28%] w-5 aspect-square end-4 ${item?.iconEndUrlClassName} ${
            item?.iconEndFunc ? "cursor-pointer" : ""
          }`}
          onClick={() => {
            if (item?.iconEndFunc) item?.iconEndFunc();
          }}
          src={`${item?.iconEndUrl}`}
        />
      )}
      {!!item?.maxLengthShower && (
        <p className={`absolute top-[0.75rem] w-5 aspect-square end-8 `}>
          {`${value}`?.split("").length}/{item?.maxLength}
        </p>
      )}
      {!!item?.extraElement && <span>{item?.extraElement}</span>}
      {!!item?.hint && (
        <div
          id={`${item?.id}`}
          className={`text-xs font-light text-ink-subtle mt-1 ms-5 `}
        >
          {item?.hint}
        </div>
      )}

      {!!item?.convertToText && !!value && (
        <div id={`${item?.id}`} className="text-xs text-link mt-1">
          {amountInWords(value)} {t("toman")}
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
