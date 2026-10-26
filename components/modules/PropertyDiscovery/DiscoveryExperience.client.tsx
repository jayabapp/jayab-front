"use client";

import { DiscoveryMapProvider } from "@features/properties/context/DiscoveryMapContext";
import { useDiscoveryQuery } from "@features/properties/context/DiscoveryContext";
import { DiscoveryProvider } from "@features/properties/context/DiscoveryContext";

import type { DiscoveryExperienceProps } from "@/types/components/modules/property-discovery";
import type { ReactNode } from "react";

import DiscoveryLayout from "./parts/DiscoveryLayout.client";

const MapScope = ({ children }: { children: ReactNode }) => (
  <DiscoveryMapProvider hasMapArea={Boolean(useDiscoveryQuery().bbox)}>
    {children}
  </DiscoveryMapProvider>
);

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
