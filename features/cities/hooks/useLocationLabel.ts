"use client";

import { resolveLocationFromTree } from "@features/cities/lib/location-label";
import { useCurrentLocationQuery } from "@features/cities/hooks/useCurrentLocationQuery";
import { buildLocationLabel } from "@features/cities/lib/location-label";
import { storedEntriesFor } from "@features/cities/lib/location-label";
import { useLocationWords } from "@features/cities/hooks/useLocationWords";
import { hasLocationQuery } from "@features/cities/lib/location-label";
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
  const { data: tree } = useCityTree(hasLocationQuery(location));
  if (!hasLocationQuery(location)) return "";
  return (
    buildLocationLabel(resolveLocationFromTree(tree, location), words) ||
    storedLabel
  );
};
