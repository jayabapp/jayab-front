import { NewCitiesListDto } from "@/api_services/city/city.interface";
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
  selectedProv: NewCitiesListDto | null;
}) => {
  return (
    <div className="app-text flex justify-between border-b items-center py-5 custome-shadow-card px-4 sticky top-0 bg-white dark:bg-zinc-800 z-10">
      <img
        onClick={removeSelectedProve}
        className={` -rotate-90 transition-all  ${!!selectedProv ? "" : "opacity-0"} `}
        src="/assets/icons/shared/chevron.svg"
      />{" "}
      <p className=" text-base font-semibold">{!selectedProv ? _STRINGS.SELECT_PROVE_CITY : _STRINGS.SELECT_CITY}</p>
      <img src="/assets/icons/adds/x_mark.svg" className="w-3 h-3 dark:invert" alt="" onClick={onHide} />
    </div>
  );
};

export default CityModalHeaderPart;
