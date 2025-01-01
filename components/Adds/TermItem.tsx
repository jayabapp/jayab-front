import React from "react";
import Checkbox from "../shared/Form/Checkbox";

const PropTermItem = ({
  isChecked,
  onSelect,
  title,
  desc,
}: {
  desc: string;
  title: string;
  isChecked: boolean;
  onSelect: () => void;
}) => {
  return (
    <div className="flex flex-col gap-3 border  rounded-10  p-2">
      <Checkbox isChecked={isChecked} onSelect={onSelect} title={title} rounded="rounded-full" />

      <p className="text-xs md:text-sm">{desc}</p>
    </div>
  );
};

export default PropTermItem;
