import { useDir } from "@hooks/useDir";
import { memo } from "react";

import type { MultiLineFormInputProps } from "@/types/components/elements/form";

import ContentImage from "@elements/Image/ContentImage";

const FormInput = ({
  item,
  value,
  errors,
  onChangeText,
  errorKey = "",
}: MultiLineFormInputProps) => {
  const dir = useDir();
  return (
    <div className={item?.containerClass + " "}>
      {item?.title ? (
        <label
          htmlFor={`input-${item?.id}`}
          className={`block  mb-3 me-1 text-sm   ps-1 font-normal  ${
            item?.isMandatory && "after:content-['*'] after:ms-1 "
          } ${item?.titleClass || ""}`}
        >
          {item?.title}
          <span className="fs-8 text-status-danger">{item?.titleHint}</span>
        </label>
      ) : (
        <></>
      )}
      <textarea
        rows={item?.rows || 3}
        className={`${!!item?.iconUrl ? " !pe-10" : ""}  ${!!item?.iconEndUrl ? " !ps-10" : ""} ${
          item?.direction ? item?.direction : dir
        }  text-start form-control !transform-none text-base font-normal  bg-surface     border border-control  focus:border-action/30 py-4 px-4 w-full rounded-10 placeholder:text-ink-subtle placeholder:text-start   placeholder:font-normal placeholder:text-sm placeholder:opacity-70   ${
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
        onChange={(v) => onChangeText(v.target.value)}
        maxLength={item?.maxLength || 512}
        disabled={item?.disabled}
        value={value}
      />

      {!!item?.iconUrl && (
        <ContentImage
          alt=""
          height={24}
          width={24}
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
          alt=""
          height={24}
          width={24}
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
