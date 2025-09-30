import React from "react";

const FormCounter = ({ value, max }: { value: string | number; max: number }) => {
  return (
    <div className="absolute   left-2 text-xs text-gray-400 bottom-0">
      {`${value}`?.length}/{max}
    </div>
  );
};

export default FormCounter;
