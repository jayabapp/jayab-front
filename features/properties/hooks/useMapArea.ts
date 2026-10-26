"use client";

import { BBOX_PARAM, canonicalBbox } from "@features/properties/lib/bbox";
import { useDiscoveryQueryReplace } from "@features/properties/hooks/useDiscoveryQueryReplace";
import { useDiscoveryQuery } from "@features/properties/context/DiscoveryContext";
import { useDiscoveryMap } from "@features/properties/context/DiscoveryMapContext";
import { withoutMapArea } from "@features/properties/lib/discovery-filter-policy";
import { withMapArea } from "@features/properties/lib/discovery-filter-policy";
import { useCallback } from "react";

export const useMapArea = () => {
  const query = useDiscoveryQuery();
  const replaceQuery = useDiscoveryQueryReplace();
  const { setAutoSearch } = useDiscoveryMap();

  const applyArea = useCallback(
    (bbox: string, options?: { push?: boolean }) =>
      replaceQuery(withMapArea(query, bbox), { ...options, scroll: false }),
    [query, replaceQuery],
  );

  const clearArea = useCallback(() => {
    setAutoSearch(false);
    replaceQuery(withoutMapArea(query), { scroll: false });
  }, [query, replaceQuery, setAutoSearch]);

  return {
    applyArea,
    clearArea,
    rawArea: query[BBOX_PARAM] ?? null,
    appliedBbox: canonicalBbox(query[BBOX_PARAM]),
  };
};
