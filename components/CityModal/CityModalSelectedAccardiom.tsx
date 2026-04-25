import { ChildCities, NewCitiesListDto } from "@/api_services/city/city.interface";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import SimpleAccordion from "../shared/SimpleAccorion";

const CityModalSelectedAccardiom = ({
  selectedCities,
  onCityClick,
  provinces,
  onProvCancelClick,
}: {
  selectedCities: any[];
  onCityClick: (item: NewCitiesListDto | ChildCities) => void;
  onProvCancelClick: (item: NewCitiesListDto) => void;
  provinces: NewCitiesListDto[] | undefined;
}) => {
  const [selectedProvs, setSelectedProves] = useState<NewCitiesListDto[] | undefined>([]);

  useEffect(() => {
    if (!!provinces) {
      const copiedProvs = JSON.parse(JSON.stringify([...provinces]));
      setSelectedProves(
        copiedProvs
          ?.filter((e: any) => e?.child?.some((f: any) => selectedCities?.some((x) => x?.id == f?.id)))
          ?.map((e: any) => ({
            ...e,
            child: e?.child?.filter((f: any) => selectedCities?.some((x) => x?.id == f?.id)),
          })),
      );
    }
  }, [provinces, selectedCities]);
  return (
    <SimpleAccordion
      item={{ parenClass: ` transition-all !px-0 ` }}
      isOpenFirst={!isEmpty(selectedProvs)}
      title={`${_STRINGS.SELECTED_CITIES}  ${!isEmpty(selectedCities) ? `(${selectedCities?.length} شهر)` : ""} `}
    >
      <div className={` gap-2 w-full flex flex-wrap`}>
        {!!selectedProvs && selectedProvs.length > 0 ? (
          selectedProvs.map((val, index) => {
            const selectedMainProv = provinces?.find((x) => x?.id == val?.id);
            if (selectedMainProv?.child?.length == val?.child?.length) {
              return (
                <div
                  key={`selectedItemsPROv${val?.id || val}`}
                  className="rounded-full gap-4 py-1 px-1 flex items-center justify-center border border-primary-700/30  bg-primary-700/5  text-xs "
                >
                  <p className="text-sm text-primary-text  font-medium  pr-2">
                    {" "}
                    {_STRINGS.PROVINCE} {val?.title}{" "}
                  </p>
                  <div
                    onClick={() => {
                      onProvCancelClick(val);
                    }}
                    className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700/30  flex items-center justify-center"
                  >
                    <img
                      src="/assets/icons/adds/x_mark.svg"
                      className="w-2.5 h-2.5    opacity-30 p-0.5  text-primary-text aspect-square "
                    />
                  </div>
                </div>
              );
            } else
              return val?.child?.map((e) => (
                <div
                  key={`selectedItems${e?.id || e?.title}`}
                  className="rounded-full gap-4 py-1 px-1 flex items-center justify-center border border-primary-700/30  bg-primary-700/5  text-xs "
                >
                  <p className="text-sm text-primary-text   pr-2">{e?.title} </p>
                  <div
                    onClick={() => {
                      onCityClick(e);
                    }}
                    className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700/30  flex items-center justify-center"
                  >
                    <img
                      src="/assets/icons/adds/x_mark.svg"
                      className="w-2.5 h-2.5    opacity-30 p-0.5  text-primary-text aspect-square "
                    />
                  </div>
                </div>
              ));
          })
        ) : (
          <></>
        )}
      </div>
    </SimpleAccordion>
  );
};

export default CityModalSelectedAccardiom;
