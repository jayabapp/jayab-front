"use client";

import { normalizePropertyFilters } from "@features/properties/lib/normalize-property-filters";
import { DiscoveryMapProvider } from "@features/properties/context/DiscoveryMapContext";
import { useDiscoveryQuery } from "@features/properties/context/DiscoveryContext";
import { DiscoveryProvider } from "@features/properties/context/DiscoveryContext";

import type { DiscoveryExperienceProps } from "@/types/components/modules/property-discovery";
import type { ReactNode } from "react";

import DiscoveryLayout from "./parts/DiscoveryLayout.client";

const MapScope = ({ children }: { children: ReactNode }) => {
  const query = useDiscoveryQuery();
  const searchScope = JSON.stringify(
    normalizePropertyFilters({
      ...query,
      page: undefined,
      per_page: undefined,
      sort_type: undefined,
    }),
  );
  return (
    <DiscoveryMapProvider
      hasMapArea={Boolean(query.bbox)}
      searchScope={searchScope}
    >
      {children}
    </DiscoveryMapProvider>
  );
};

const DiscoveryExperience = ({
  baselineFilters,
  ...layoutProps
}: DiscoveryExperienceProps) => (
  <DiscoveryProvider baseline={baselineFilters}>
    <MapScope>
      <DiscoveryLayout {...layoutProps} />
    </MapScope>
  </DiscoveryProvider>
);

export default DiscoveryExperience;
