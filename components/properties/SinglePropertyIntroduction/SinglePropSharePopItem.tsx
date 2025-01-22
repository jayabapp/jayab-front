import Checkbox from "@/components/shared/Form/Checkbox";
import React from "react";

const SinglePropSharePopItem = ({ data, isChecked, cb }: { cb: () => void | null; isChecked: boolean; data: any }) => {
  return (
    <div onClick={cb} className="flex  cursor-pointer items-center justify-between  w-full">
      <div className="flex items-center gap-2">
        <img src={data?.icon} className=" w-4 h-4" alt="" />
        <p className="text-xs md:text-sm">{data?.title}</p>
      </div>

      <Checkbox onSelect={cb} isChecked={isChecked} />
    </div>
  );
};

export default SinglePropSharePopItem;
