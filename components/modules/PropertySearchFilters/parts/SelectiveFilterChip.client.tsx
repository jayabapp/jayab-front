"use client";

import { useDiscoveryQuery } from "@features/properties/context/DiscoveryContext";

import type { SelectiveFilterChipProps } from "@/types/components/modules/property-search-filters";
import type { IconName } from "@/types/components/elements/icon";

import PropertyModelFilter from "../PropertyModelFilter.client";
import FilterEditorChip from "./FilterEditorChip.client";

const FILTER_ICONS: Record<string, IconName> = {
  property_type: "home",
  pool_type: "bath",
  pattern: "gazebo",
  entertainment: "billiard",
  welfare: "sparkles",
  cool_heat: "air-conditioner",
  kitchen: "kitchen",
  ownership: "shield",
};

const SelectiveFilterChip = ({
  list,
  title,
  queryKey,
}: SelectiveFilterChipProps) => {
  const query = useDiscoveryQuery();

  return (
    <FilterEditorChip
      showCount
      title={title}
      keys={[queryKey]}
      icon={FILTER_ICONS[queryKey]}
      renderEditor={(draft, setDraft) => (
        <PropertyModelFilter
          isMulty
          list={list}
          query={query}
          queryKey={queryKey}
          mobileFilters={draft}
          setMobileFilters={setDraft}
          containerClass="grid w-full grid-cols-2 gap-x-3"
        />
      )}
    />
  );
};

export default SelectiveFilterChip;
