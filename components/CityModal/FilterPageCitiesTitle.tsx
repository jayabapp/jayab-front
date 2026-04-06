import { ChildCities } from "@/api_services/city/city.interface";
import queryBuilder from "@/helpers/queryBuilder";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useCallback } from "react";
import RegionButton from "./RegionButton";

const FilterPageCitiesTitle = ({
  title,
  cb,
  cityWithRegions,
  queries,
  hideCityPart,
  showRegions,
  setShowRegions,
}: {
  title?: string;
  cb: () => void | null;
  cityWithRegions: ChildCities | null;
  queries: any;
  hideCityPart?: boolean;
  setShowRegions: Dispatch<SetStateAction<boolean>>;
  showRegions: boolean;
}) => {
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
    [queries],
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
          <RegionButton
            regionsIds={regionsIds}
            removeFiltersKeys={removeFiltersKeys}
            setShowRegions={setShowRegions}
            containerClass="hidden lg:flex"
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default FilterPageCitiesTitle;
