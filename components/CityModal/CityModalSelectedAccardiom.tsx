import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import React from "react";
import SimpleAccordion from "../shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";
import { isEmpty } from "lodash";
import { NewCitiesListDto } from "@/api_services/city/city.interface";

const CityModalSelectedAccardiom = ({
  selectedCities,
  onCityClick,
}: {
  selectedCities: any[];
  onCityClick: (item: NewCitiesListDto) => void;
}) => {
  return (
    <SimpleAccordion
      item={{ parenClass: ` transition-all !px-0 ` }}
      title={`${_STRINGS.SELECTED_CITIES}  ${!isEmpty(selectedCities) ? `(${selectedCities?.length} شهر)` : ""} `}
    >
      <div className={` gap-2 w-full flex flex-wrap`}>
        {selectedCities.length > 0 ? (
          selectedCities.map((val, index) => (
            <div
              key={`selectedItems${val?.id || val}`}
              className="rounded-full gap-4 py-1 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs "
            >
              <p className="text-xs pr-2">{val?.title} </p>
              <div
                onClick={() => {
                  onCityClick(val);
                }}
                className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
              >
                <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </SimpleAccordion>
  );
};

export default CityModalSelectedAccardiom;
