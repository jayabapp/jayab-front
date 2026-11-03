import { useTranslations } from "next-intl";
import { Checkbox } from "@elements/Form";

import type { CityModalAllCitiesButtonProps } from "@/types/components/modules/city-selector";

import isEmpty from "lodash/isEmpty";

const CityModalAllCitiesButton = ({
  cities,
  onToggleAll,
  selectedCities,
}: CityModalAllCitiesButtonProps) => {
  const t = useTranslations("search");

  const missingCities = (cities ?? []).filter(
    (city) => !selectedCities?.some((selected) => selected?.id === city?.id),
  );
  const isChecked = !isEmpty(cities) && isEmpty(missingCities);

  return (
    <div className="flex items-start justify-start gap-2">
      <Checkbox
        isChecked={isChecked}
        title={t("allCities")}
        onSelect={() =>
          onToggleAll(
            isChecked
              ? selectedCities.filter(
                  (selected) =>
                    !cities?.some((city) => city?.id === selected?.id),
                )
              : [...selectedCities, ...missingCities],
          )
        }
      />
    </div>
  );
};

export default CityModalAllCitiesButton;
