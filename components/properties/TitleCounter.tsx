import React from "react";
import { Counter } from "@elements/Form";

const TitleCounter = ({
  title,
  value,
  onChange,
  disableInput,
}: {
  title: string;
  value: string | number | null;
  onChange: (e: number) => void | null;
  disableInput?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-sm w-full">{title}</p>

      <div className="w-[40%]">
        {" "}
        <Counter plusMinusNumber={1} setValue={onChange} value={value} items={{ disableInput: disableInput }} />
      </div>
    </div>
  );
};

export default TitleCounter;
