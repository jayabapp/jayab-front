"use client";

import { usePropertyLocationOptions } from "./usePropertyLocationOptions";
import { useMapAddressSearch } from "@features/map/hooks/useMapAddressSearch";
import {
  findAddressNearCity,
  findCityLocation,
} from "@features/map/lib/property-location-match";
import { useCallback, useMemo, useState } from "react";

import type { PropInitDto } from "@/types/features/owner-property";

const DEFAULT_CENTER = [51.37, 35.767];

type Point = { lat: number | string; lng: number | string };
type Selection = {
  id: PropInitDto["id"] | undefined;
  center: number[] | null;
  jumpTo: Point | null;
};

export const usePropertyLocation = (draft?: PropInitDto) => {
  const address = String(draft?.address ?? "");
  const [selection, setSelection] = useState<Selection>({
    id: draft?.id,
    center: null,
    jumpTo: null,
  });
  if (selection.id !== draft?.id)
    setSelection({ id: draft?.id, center: null, jumpTo: null });

  const savedPoint = useMemo(() => {
    const lat = Number(draft?.lat);
    const lng = Number(draft?.lng);
    return lat >= 24 && lat <= 40 && lng >= 44 && lng <= 64
      ? { lat, lng }
      : null;
  }, [draft?.lat, draft?.lng]);

  const { provinces, cities, regions, isLoading: isLoadingPlaces } =
    usePropertyLocationOptions(draft?.province_id, draft?.city_id);
  const province = provinces.find((item) => item.id == draft?.province_id);
  const city = cities.find((item) => item.id == draft?.city_id);
  const region = regions.find((item) => item.id == draft?.region_id);
  const needsLookup = Boolean(draft?.id && !savedPoint && !selection.center);

  // Resolve the city first. Street names may also exist near the old Tehran
  // default center, so a result is accepted only inside the chosen city.
  const locality = useMapAddressSearch(
    [city?.title, province?.title].filter(Boolean).join(" "),
    DEFAULT_CENTER,
    needsLookup && !isLoadingPlaces && Boolean(city?.title),
  );
  const cityMatch = findCityLocation(
    locality.addresses,
    city?.title ?? "",
    province?.title ?? "",
  );
  const cityCenter = cityMatch
    ? [cityMatch.location.x, cityMatch.location.y]
    : DEFAULT_CENTER;
  const street = useMapAddressSearch(
    [city?.title, region?.title, address.trim()].filter(Boolean).join(" "),
    cityCenter,
    needsLookup && Boolean(cityMatch) && Boolean(address.trim()),
  );
  const addressMatch = cityMatch
    ? findAddressNearCity(
        street.addresses,
        cityMatch,
        city?.title ?? "",
        region?.title ?? "",
        address,
      )
    : null;
  const match = address.trim() ? addressMatch : cityMatch;
  const initialPoint = useMemo(
    () =>
      savedPoint ??
      (match ? { lat: match.location.y, lng: match.location.x } : null),
    [savedPoint, match],
  );
  const center = useMemo(
    () =>
      selection.center ??
      (initialPoint
        ? [Number(initialPoint.lng), Number(initialPoint.lat)]
        : DEFAULT_CENTER),
    [selection.center, initialPoint],
  );

  const setCenter = useCallback(
    (next: number[]) => {
      // Initial camera placement also emits moveend; keep the typed address until
      // the host actually moves the pin or chooses a search result.
      if (
        Math.abs(next[0] - center[0]) < 0.000001 &&
        Math.abs(next[1] - center[1]) < 0.000001
      ) return;
      setSelection((current) => ({ ...current, center: next }));
    },
    [center],
  );

  const selectPoint = useCallback((point: Point) => {
    setSelection((current) => ({
      ...current,
      center: [Number(point.lng), Number(point.lat)],
      jumpTo: point,
    }));
  }, []);

  return {
    address,
    center,
    searchCenter: cityMatch ? cityCenter : center,
    setCenter,
    selectPoint,
    jumpTo: selection.center ? selection.jumpTo : initialPoint,
    hasMoved: selection.center !== null,
    hasLocation: Boolean(selection.center || initialPoint),
    isLocating:
      needsLookup &&
      (isLoadingPlaces ||
        locality.isFetching ||
        locality.isDebouncing ||
        street.isFetching ||
        street.isDebouncing),
  };
};
