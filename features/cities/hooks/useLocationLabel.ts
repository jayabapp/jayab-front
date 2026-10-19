"use client";

import {
  buildLocationLabel,
  hasLocationQuery,
  resolveLocationFromTree,
  storedEntriesFor,
} from "@features/cities/lib/location-label";
import { useCurrentLocationQuery } from "@features/cities/hooks/useCurrentLocationQuery";
import { useLocationWords } from "@features/cities/hooks/useLocationWords";
import { useCitiesStore } from "@/store";
import { useCityTree } from "@features/cities/hooks/useCityTree";

export const useLocationLabel = (): string => {
  const words = useLocationWords();
  const location = useCurrentLocationQuery();
  const locationsData = useCitiesStore((state) => state.locationsData);

  const storedEntries = storedEntriesFor(locationsData, location);
  const storedLabel = storedEntries
    ? buildLocationLabel(storedEntries, words)
    : "";
  const needsTree = hasLocationQuery(location) && !storedLabel;

  const { data: tree } = useCityTree(needsTree);

  if (storedLabel) return storedLabel;
  if (!hasLocationQuery(location)) return "";
  return buildLocationLabel(resolveLocationFromTree(tree, location), words);
};
