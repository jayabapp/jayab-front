"use client";

import { useSelectedLocationFilters } from "@features/cities/hooks/useSelectedLocationFilters";
import type { SearchSelectedLocationsProps } from "@/types/components/modules/search";

import SearchLocationChip from "./SearchLocationChip";
import _STRINGS from "@/utils/LocalStrings";

/** Location chips for whatever the last search resolved to; removing one rewrites the URL. */
const SearchSelectedLocations = ({ onClose }: SearchSelectedLocationsProps) => {
  const {
    cities,
    hasSelection,
    provinces,
    regions,
    toggleCity,
    toggleProvince,
    toggleRegion,
  } = useSelectedLocationFilters(onClose);

  if (!hasSelection) return null;

  return (
    <div className="w-full p-4 flex flex-col gap-2">
      <p>{_STRINGS.SELECTED_CITIES}</p>
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
