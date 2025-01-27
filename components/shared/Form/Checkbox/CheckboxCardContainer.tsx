import React, { ReactNode } from "react";
import Checkbox from ".";

const CheckboxCardContainer = ({
  isChecked,
  onSelect,
  title,
  description,
  children,
  item,
}: {
  isChecked: boolean;
  onSelect: () => void;

  title?: string;
  description?: string;
  children?: ReactNode;
  item?: {
    disabled?: boolean;
  };
}) => {
  return (
    <div
      className={`w-full flex flex-col gap-2 rounded-10 border p-2 ${item?.disabled ? " opacity-50 grayscale" : ""} `}
    >
      <Checkbox isChecked={isChecked} onSelect={item?.disabled ? () => {} : onSelect} title={title} />
      <p className="text-xs md:text-sm">{description}</p>
      <span> {children}</span>
    </div>
  );
};

export default CheckboxCardContainer;
