import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const ModalHeaderPart = ({ onHide, title }: { onHide: () => void | null; title: string }) => {
  return (
    <div className="app-text flex justify-between border-b items-center py-3 px-4 sticky top-0 bg-white dark:bg-zinc-800 z-10">
      <div className="flex flex-row gap-2">
        {" "}
        <h3 className=" text-base font-semibold">{title}</h3>
      </div>{" "}
      <img src="/assets/icons/adds/x_mark.svg" className="w-3 h-3 dark:invert" alt="" onClick={onHide} />
    </div>
  );
};

export default ModalHeaderPart;
