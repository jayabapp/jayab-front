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

import useQueryGet from "@/helpers/queryGet";

export const useLocationLabel = (): string => {
  const pathname = usePathname();
  const urlQueries = useQueryGet<Record<string, string>>();
  const locationsData = useCitiesStore((state) => state.locationsData);

  const urlLocation = pickLocationQuery(urlQueries);
  const hasUrlLocation = hasLocationQuery(urlLocation);
  const isStoredForPage = isSameLocationPath(locationsData?.path, pathname);
  const location = hasUrlLocation
    ? urlLocation
    : isStoredForPage
      ? pickLocationQuery(locationsData?.query)
      : {};

  const storedEntries = hasUrlLocation
    ? storedEntriesFor(locationsData, urlLocation)
    : null;
  const storedLabel = storedEntries ? buildLocationLabel(storedEntries) : "";
  const needsTree =
    hasLocationQuery(location) &&
    !storedLabel &&
    !(isStoredForPage && !hasUrlLocation && locationsData?.label);

  const { data: tree } = useCityTree(needsTree);

  if (!hasUrlLocation && isStoredForPage && locationsData?.label)
    return locationsData.label;
  if (storedLabel) return storedLabel;
  if (!hasLocationQuery(location)) return "";
  return buildLocationLabel(resolveLocationFromTree(tree, location));
};
