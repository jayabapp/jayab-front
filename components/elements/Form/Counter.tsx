import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { p2e } from "@/helpers/NumberConverter";

import type { CounterProps } from "@/types/components/elements/form";

import ContentImage from "@elements/Image/ContentImage";
import NumberFlow from "@number-flow/react";

const Counter = ({
  max,
  value,
  items,
  setValue,
  placeholder,
  containerClass,
  plusMinusNumber,
}: CounterProps) => {
  const t = useTranslations("common");

  const inputRef = useRef<HTMLInputElement>(null);
  const [animated, setAnimated] = useState(true);
  const [showCaret, setShowCaret] = useState(true);
  const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: el,
  }) => {
    setAnimated(false);
    let next = value;
    if (el.value === "") {
      next = 0;
    } else {
      const num = parseInt(p2e(el.value));
      if (!isNaN(num) && 0 <= num && (!!max ? num <= max : true)) next = num;
    }
    if (inputRef.current && el.value.length >= 4) inputRef.current.blur();
    el.value = String(next);
    setValue(Number(next));
  };
  return (
    <div
      className={`transition-all p-1 bg-surface  duration-150 ease-in-out   w-full flex items-center justify-between ltr:flex-row-reverse ${containerClass} `}
    >
      <button
        aria-label={t("increase")}
        onClick={() => {
          setAnimated(true);
          if (!!max) {
            if (value + (plusMinusNumber || 50000) <= max) setValue(value + (plusMinusNumber || 50000));
          } else setValue(value + (plusMinusNumber || 50000));
        }}
        className="cursor-pointer select-none shrink-0 rounded-md transition-all duration-150 ease-in-out aspect-square flex bg-surface border border-action w-5 h-5 items-center justify-center"
        type="button"
      >
        <ContentImage
          alt=""
          width={24}
          height={24}
          className="w-2 h-2 select-none"
          src="/assets/icons/adds/blue_plus.svg"
        />
      </button>

      <div className="relative grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap]">
        <input
          maxLength={4}
          tabIndex={-1}
          autoFocus={false}
          ref={inputRef}
          className={`	${showCaret ? "" : "text-transparent"}
						!text-center !tracking-[0.15rem]  ltr  placeholder:!text-center  bg-transparent   text-base !font-semibold space-x-4  w-full h-full  ${
              items?.inpuClass
            }`}
            value={value}
            type="tel"
          style={{ fontKerning: "none" }}
          placeholder={!!placeholder ? placeholder : "0"}
          step={plusMinusNumber}
          autoComplete="off"
          inputMode="numeric"
          onChange={handleInput}
          disabled={!!items?.disableInput}
        />
        <NumberFlow
          aria-hidden
          value={value}
          animated={animated}
          format={{ useGrouping: false }}
          style={{ position: "absolute" }}
          onAnimationsStart={() => setShowCaret(false)}
          onAnimationsFinish={() => setShowCaret(true)}
          className={`pointer-events-none  text-base !font-medium !space-x-14  !tracking-[0.15rem] ${
            showCaret ? "text-transparent" : ""
          }  ${items?.inpuClass}`}
          willChange
        />
      </div>
      <button
        aria-label={t("decrease")}
        onClick={() => {
          setAnimated(true);
          if (value <= (plusMinusNumber || 50000)) setValue(0);
           else setValue(value - (plusMinusNumber || 50000));
        }}
        className="cursor-pointer select-none shrink-0 rounded-md border transition-all duration-150 ease-in-out aspect-square flex bg-surface border-action w-5 h-5 items-center justify-center"
        type="button"
      >
        <ContentImage
          alt=""
          width={24}
          height={24}
          src={"/assets/icons/adds/blue_minus.svg"}
          className="w-2 h-2 aspect-square select-none "
        />
      </button>
    </div>
  );
};

export default Counter;
