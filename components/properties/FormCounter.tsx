import React from "react";

const FormCounter = ({
  value,
  max,
  containerClass,
}: {
  value: string | number;
  max: number;
  containerClass?: string;
}) => {
  return (
    <div className={`absolute   left-2 text-xs text-gray-400 bottom-0  ${containerClass}`}>
      {max - `${value}`?.length}/{max}
    </div>
  );
};

export default FormCounter;
