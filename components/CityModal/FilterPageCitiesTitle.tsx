import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const FilterPageCitiesTitle = ({ title, cb }: { title?: string; cb: () => void | null }) => {
  return (
    <div onClick={cb} className=" cursor-pointer  flex items-center  gap-2">
      <img src="/assets/icons/adds/pin_point_location.svg" />
      <p>{!!title ? title : _STRINGS.SELECT_CITY}</p>
      {!!title ? <img className="w-4 h-4" src="/assets/icons/addresses/orange_edit_pen.svg" /> : <></>}
    </div>
  );
};

export default FilterPageCitiesTitle;
