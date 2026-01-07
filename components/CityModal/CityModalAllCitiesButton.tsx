import { ChildCities } from "@/api_services/city/city.interface";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import React from "react";
import Checkbox from "../shared/Form/Checkbox";

const CityModalAllCitiesButton = ({
  cities,
  selectedCities,
  setSelectedCities,
}: {
  cities: ChildCities[] | undefined;
  setSelectedCities: React.Dispatch<React.SetStateAction<any[]>>;
  selectedCities: ChildCities[];
}) => {
  const onSelectAllClick = () => {
    const missingCities = cities?.filter((e) => !selectedCities?.find((x) => x?.id == e?.id));
    if (isEmpty(missingCities)) {
      setSelectedCities((e) => e?.filter((x) => !selectedCities?.find((y) => y?.id == x?.id)));
    } else if (!isEmpty(missingCities) && !!missingCities) {
      setSelectedCities((e) => [...e, ...missingCities]);
    }
  };
  return (
    <div className="flex items-start justify-start gap-2">
      <Checkbox
        onSelect={onSelectAllClick}
        isChecked={!isEmpty(cities) && isEmpty(cities?.filter((e) => !selectedCities?.find((x) => x?.id == e?.id)))}
        title={_STRINGS.ALL_CITIES}
      />
    </div>
  );
};

export default CityModalAllCitiesButton;
