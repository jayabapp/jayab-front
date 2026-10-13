"use client";

import {
  buildLocationLabel,
  hasLocationQuery,
  isSameLocationPath,
  pickLocationQuery,
  resolveLocationFromTree,
  storedEntriesFor,
} from "@features/cities/lib/location-label";
import { useCitiesStore } from "@/store";
import { usePathname } from "next/navigation";
import { useCityTree } from "@features/cities/hooks/useCityTree";
import { useLocationWords } from "@features/cities/hooks/useLocationWords";

import useQueryGet from "@/helpers/queryGet";

export const useLocationLabel = (): string => {
  const pathname = usePathname();
  const words = useLocationWords();
  const urlQueries = useQueryGet<Record<string, string>>();
  const locationsData = useCitiesStore((state) => state.locationsData);

  const urlLocation = pickLocationQuery(urlQueries);
  const hasUrlLocation = hasLocationQuery(urlLocation);
  const isStoredForPage = isSameLocationPath(locationsData?.path, pathname);
  const storedLocation = isStoredForPage
    ? pickLocationQuery(locationsData?.query)
    : {};
  const location = hasUrlLocation
    ? !urlLocation.cities && !urlLocation.provinces
      ? { ...storedLocation, ...urlLocation }
      : urlLocation
    : isStoredForPage
      ? storedLocation
      : {};

  const storedEntries = hasUrlLocation
    ? storedEntriesFor(locationsData, location)
    : null;
  const storedLabel = storedEntries
    ? buildLocationLabel(storedEntries, words)
    : "";
  const needsTree =
    hasLocationQuery(location) &&
    !storedLabel &&
    !(isStoredForPage && !hasUrlLocation && locationsData?.label);

  const { data: tree } = useCityTree(needsTree);

  if (!hasUrlLocation && isStoredForPage && locationsData?.label)
    return locationsData.label;
  if (storedLabel) return storedLabel;
  if (!hasLocationQuery(location)) return "";
  return buildLocationLabel(resolveLocationFromTree(tree, location), words);
};
