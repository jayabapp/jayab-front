import React from "react";

const LinearTextBlock = ({ title, value, unit }: { title: string; value: string | number; unit?: string | number }) => {
  return (
    <div className="flex items-center justify-between w-full ">
      <p className="text-sm font-light">{title}</p>

      <p className="font-medium">
        {value} <span className="font-light">{unit}</span>
      </p>
    </div>
  );
};

export default LinearTextBlock;
