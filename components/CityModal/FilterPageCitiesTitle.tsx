import { ChildCities } from "@/api_services/city/city.interface";
import queryBuilder from "@/helpers/queryBuilder";
import _STRINGS from "@/utils/LocalStrings";
import { isEmpty } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import RegionModal from "./RegionModal";

const FilterPageCitiesTitle = ({
  title,
  cb,
  cityWithRegions,
  queries,
  hideCityPart,
}: {
  title?: string;
  cb: () => void | null;
  cityWithRegions: ChildCities | null;
  queries: any;
  hideCityPart?: boolean;
}) => {
  const [showRegions, setShowRegions] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const regionsIds = queries?.regions
    ?.split(",")

    ?.filter((f: any) => !!f);

  const removeFiltersKeys = useCallback(
    (array: string[]) => {
      let temp = { ...queries };

      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        delete temp[element];
      }
      delete temp.page;
      const body = {
        ...temp,
      };
      router.replace(`${pathname}?${queryBuilder(body)}`);
      // router.replace(`/rooms?${queryBuilder(body)}`);
    },
    [queries]
  );

  return (
    <>
      <div
        onClick={!!hideCityPart ? undefined : cb}
        className=" shrink-0 cursor-pointer text-sm   md:text-base w-fit flex items-center  gap-2"
      >
        {!!hideCityPart ? (
          <></>
        ) : (
          <>
            {" "}
            <img src="/assets/icons/adds/pin_point_location.svg" />
            <p className="shrink-0">{!!title ? title : _STRINGS.SELECT_CITY}</p>
            {!!title ? <img className="w-4 h-4" src="/assets/icons/addresses/orange_edit_pen.svg" /> : <></>}
          </>
        )}

        {!isEmpty(cityWithRegions?.child) ? (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowRegions(true);
            }}
            className={`rounded-full !w-auto  min-w-16 gap-2   py-2 h-8 px-1 flex items-center justify-center border ${
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
        ) : (
          <></>
        )}
      </div>
      <RegionModal
        cityWithRegions={cityWithRegions}
        show={showRegions}
        onHide={() => {
          setShowRegions(false);
        }}
      />{" "}
    </>
  );
};

export default FilterPageCitiesTitle;
