"use client";

import { createContext, useContext, useMemo } from "react";
import { canonicalizeDiscoveryFilters } from "@features/properties/lib/discovery-filters";

import type { ReactNode } from "react";

import useQueryGet from "@/helpers/queryGet";

type DiscoveryContextValue = { baseline: Record<string, string> };

const NO_BASELINE: Record<string, string> = {};
const DiscoveryContext = createContext<DiscoveryContextValue>({
  baseline: NO_BASELINE,
});

export const DiscoveryProvider = ({
  baseline,
  children,
}: {
  baseline?: Record<string, string>;
  children: ReactNode;
}) => {
  const value = useMemo(
    () => ({ baseline: baseline ?? NO_BASELINE }),
    [baseline],
  );
  return (
    <DiscoveryContext.Provider value={value}>
      {children}
    </DiscoveryContext.Provider>
  );
};

export const useDiscoveryBaseline = () => useContext(DiscoveryContext).baseline;

export const useDiscoveryQuery = () => {
  const baseline = useDiscoveryBaseline();
  const url = useQueryGet<Record<string, string>>();
  return canonicalizeDiscoveryFilters({ ...baseline, ...url });
};
