import React from "react";

import NumberFlow from "@number-flow/react";
import _STRINGS from "@/utils/LocalStrings";
import { p2e } from "@/helpers/NumberConverter";
const Counter = ({
  value,
  setValue,
  placeholder,
  plusMinusNumber,
  max,
  containerClass,
  items,
}: {
  value: any;
  setValue: (e: number) => void | null;
  placeholder?: string;
  plusMinusNumber?: number;
  max?: number;
  containerClass?: string;
  items?: { inpuClass?: string; disableInput?: boolean };
}) => {
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
      <div
        onClick={() => {
          setAnimated(true);
          if (!!max) {
            if (value + (plusMinusNumber || 50000) <= max) {
              setValue(value + (plusMinusNumber || 50000));
            }
          } else setValue(value + (plusMinusNumber || 50000));
        }}
        className="cursor-pointer  select-none shrink-0 rounded-md transition-all duration-150 ease-in-out  aspect-square flex bg-white border  border-primary-700  dark:bg-primary-600 w-5 h-5 items-center justify-center"
      >
        {" "}
        <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 select-none" />
      </div>

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
          onInput={handleInput}
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
      <div
        onClick={() => {
          setAnimated(true);
          if (value <= (plusMinusNumber || 50000)) {
            setValue(0);
          } else setValue(value - (plusMinusNumber || 50000));
        }}
        className="cursor-pointer  select-none shrink-0 rounded-md border transition-all duration-150 ease-in-out  aspect-square flex bg-white   border-primary-700  w-5 h-5 items-center justify-center"
      >
        <img className="w-2 h-2 aspect-square select-none " src={"/assets/icons/adds/blue_minus.svg"} />
      </div>
    </div>
  );
};

export default Counter;
