import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const CityModalHeaderPart = ({
  onHide,
  selectedProv,
  removeSelectedProve,
}: {
  onHide: () => void | null;
  removeSelectedProve: () => void | null;
  selectedProv: ProvienceTypesDto | null;
}) => {
  return (
    <div className="app-text flex justify-between border-b items-center py-3 px-4 sticky top-0 bg-white dark:bg-zinc-800 z-10">
      <div className="flex flex-row gap-2">
        {" "}
        <img
          onClick={removeSelectedProve}
          className={` -rotate-90 transition-all  ${!!selectedProv ? "" : "hidden"} `}
          src="/assets/icons/shared/chevron.svg"
        />{" "}
        <h3 className=" text-base font-semibold">{!selectedProv ? _STRINGS.SELECT_PROVE : _STRINGS.SELECT_CITY}</h3>
      </div>{" "}
      <img src="/assets/icons/adds/x_mark.svg" className="w-3 h-3 dark:invert" alt="" onClick={onHide} />
    </div>
  );
};

export default CityModalHeaderPart;
