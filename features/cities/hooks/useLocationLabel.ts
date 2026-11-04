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
import { resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";

export const useLocationLabel = (): string => {
  const words = useLocationWords();
  const location = useCurrentLocationQuery();
  const locationsData = useCitiesStore((state) => state.locationsData);

  const storedEntries = storedEntriesFor(locationsData, location);
  const storedLabel = storedEntries
    ? buildLocationLabel(storedEntries, words)
    : "";
  // Stored names are in whatever language the place was picked in, so outside
  // Persian the translated tree wins once it has loaded.
  const isPersian = resolveLocale(useLocale()) === "fa";
  const needsTree =
    hasLocationQuery(location) && (!storedLabel || !isPersian);

  const { data: tree } = useCityTree(needsTree);

  if (storedLabel && (isPersian || !tree)) return storedLabel;
  if (!hasLocationQuery(location)) return "";
  return buildLocationLabel(resolveLocationFromTree(tree, location), words);
};
