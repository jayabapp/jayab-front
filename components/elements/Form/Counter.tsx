import type { CounterProps } from "@/types/components/elements/form";
import { p2e } from "@/helpers/NumberConverter";

import ContentImage from "@elements/Image/ContentImage";
import _STRINGS from "@/utils/LocalStrings";
import NumberFlow from "@number-flow/react";
import React from "react";
const Counter = ({
  value,
  setValue,
  placeholder,
  plusMinusNumber,
  max,
  containerClass,
  items,
}: CounterProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [animated, setAnimated] = React.useState(true);
  // Hide the caret during transitions so you can't see it shifting around:
  const [showCaret, setShowCaret] = React.useState(true);
  const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget: el }) => {
    setAnimated(false);
    let next = value;

    if (el.value === "") {
      next = 0;
    } else {
      const num = parseInt(p2e(el.value));
      if (!isNaN(num) && 0 <= num && (!!max ? num <= max : true)) next = num;
    }
    if (inputRef.current && el.value.length >= 4) inputRef.current.blur();
    // Manually update the input.value in case the number stays the same e.g. 09 == 9
    el.value = String(next);
    setValue(Number(next));
  };
  return (
    <div
      className={`transition-all p-1 bg-white  duration-150 ease-in-out   w-full flex items-center justify-between ${containerClass} `}
    >
      <button
        aria-label={_STRINGS.INCREASE}
        onClick={() => {
          setAnimated(true);
          if (!!max) {
            if (value + (plusMinusNumber || 50000) <= max) {
              setValue(value + (plusMinusNumber || 50000));
            }
          } else setValue(value + (plusMinusNumber || 50000));
        }}
        className="cursor-pointer select-none shrink-0 rounded-md transition-all duration-150 ease-in-out aspect-square flex bg-white border border-brand-600 w-5 h-5 items-center justify-center"
        type="button"
      >
        {" "}
        <ContentImage alt="" height={24} width={24} src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 select-none" />
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
          // Make sure to disable kerning, to match NumberFlow:
          style={{ fontKerning: "none" }}
          type="tel"
          placeholder={!!placeholder ? placeholder : "0"}
          step={plusMinusNumber}
          autoComplete="off"
          inputMode="numeric"
          value={value}
          // onChange={(e) => setValue(Number(e.target.value))}
          onChange={handleInput}
          disabled={!!items?.disableInput}
        />
        <NumberFlow
          style={{ position: "absolute" }}
          value={value}
          format={{ useGrouping: false }}
          aria-hidden
          animated={animated}
          onAnimationsStart={() => setShowCaret(false)}
          onAnimationsFinish={() => setShowCaret(true)}
          className={`pointer-events-none  text-base !font-medium !space-x-14  !tracking-[0.15rem] ${
            showCaret ? "text-transparent" : ""
          }  ${items?.inpuClass}`}
          willChange
        />
      </div>
      <button
        aria-label={_STRINGS.DECREASE}
        onClick={() => {
          setAnimated(true);
          if (value <= (plusMinusNumber || 50000)) {
            setValue(0);
          } else setValue(value - (plusMinusNumber || 50000));
        }}
        className="cursor-pointer select-none shrink-0 rounded-md border transition-all duration-150 ease-in-out aspect-square flex bg-white border-brand-600 w-5 h-5 items-center justify-center"
        type="button"
      >
        <ContentImage alt="" height={24} width={24} className="w-2 h-2 aspect-square select-none " src={"/assets/icons/adds/blue_minus.svg"} />
      </button>
    </div>
  );
};

export default Counter;
