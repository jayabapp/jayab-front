"use client";

import { useSelectedLocationFilters } from "@features/cities/hooks/useSelectedLocationFilters";
import { useTranslations } from "next-intl";

import type { SearchSelectedLocationsProps } from "@/types/components/modules/search";

import SearchLocationChip from "./SearchLocationChip";

const SearchSelectedLocations = ({ onClose }: SearchSelectedLocationsProps) => {
  const t = useTranslations("search");

  const {
    cities,
    regions,
    provinces,
    toggleCity,
    hasSelection,
    toggleRegion,
    toggleProvince,
  } = useSelectedLocationFilters(onClose);

  if (!hasSelection) return null;

  return (
    <div className="w-full p-4 flex flex-col gap-2">
      <p>{t("selectedCities")}</p>
      <div className="w-full flex flex-wrap gap-2">
        {provinces.map((province) => (
          <SearchLocationChip
            isProvince
            title={province?.title}
            key={`province-${province?.id}`}
            onRemove={() => toggleProvince(province)}
          />
        ))}
        {cities.map((city) => (
          <SearchLocationChip
            title={city?.title}
            key={`city-${city?.id}`}
            onRemove={() => toggleCity(city)}
          />
        ))}
        {regions.map((region) => (
          <SearchLocationChip
            title={region?.title}
            key={`region-${region?.id}`}
            onRemove={() => toggleRegion(region)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchSelectedLocations;
