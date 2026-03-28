import _STRINGS from "@/utils/LocalStrings";
import { isEmpty } from "lodash";
import { Dispatch, SetStateAction } from "react";

const RegionButton = ({
  setShowRegions,
  regionsIds,
  removeFiltersKeys,
  containerClass,
}: {
  setShowRegions: Dispatch<SetStateAction<boolean>>;
  regionsIds: any;
  removeFiltersKeys: (array: string[]) => void;
  containerClass?: string;
}) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowRegions(true);
      }}
      className={` ${containerClass} rounded-full !w-auto  min-w-16 gap-2   py-2 h-8 px-1  items-center justify-center border ${
        isEmpty(regionsIds)
          ? "border-gray-400  bg-gray-400/5 text-gray-400"
          : "border-primary-700  bg-primary-700/5 text-primary-700"
      }  text-xs `}
    >
      <p className="text-xs pr-1 ">{!isEmpty(regionsIds) ? _STRINGS.LOCAL : _STRINGS.SELECT_LOCAL} </p>

      {!isEmpty(regionsIds) ? `(${regionsIds?.length} مورد) ` : ""}
      {!isEmpty(regionsIds) ? (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeFiltersKeys(["regions"]);
          }}
          className=" cursor-pointer w-4   h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
        >
          <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default RegionButton;
