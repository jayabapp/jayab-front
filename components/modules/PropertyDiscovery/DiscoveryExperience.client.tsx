"use client";

import { DiscoveryProvider } from "@features/properties/context/DiscoveryContext";

import type { DiscoveryExperienceProps } from "@/types/components/modules/property-discovery";

import DiscoveryLayout from "./parts/DiscoveryLayout.client";

const DiscoveryExperience = ({
  baselineFilters,
  ...layoutProps
}: DiscoveryExperienceProps) => (
  <DiscoveryProvider baseline={baselineFilters}>
    <DiscoveryLayout {...layoutProps} />
  </DiscoveryProvider>
);

export default DiscoveryExperience;
