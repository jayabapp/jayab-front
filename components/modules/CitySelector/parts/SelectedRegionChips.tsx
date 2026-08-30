import type { SelectedRegionChipsProps } from "@/types/components/modules/city-selector";

import LocationChip from "./LocationChip";

const SelectedRegionChips = ({ onRegionClick, selectedRegions }: SelectedRegionChipsProps) => (
  <div className="gap-2 w-full flex flex-wrap min-h-8 transition-all">
    {selectedRegions?.map((region) => (
      <LocationChip
        key={`selected-region-${region?.id}`}
        title={region?.title}
        onRemove={() => onRegionClick(region)}
      />
    ))}
  </div>
);

export default SelectedRegionChips;
