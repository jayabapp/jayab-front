"use client";

import { usePropertyLocationOptions } from "./usePropertyLocationOptions";
import { useMapAddressSearch } from "@features/map/hooks/useMapAddressSearch";
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

  const { provinces, cities, isLoading: isLoadingPlaces } =
    usePropertyLocationOptions(draft?.province_id, draft?.city_id);
  const province = provinces.find((item) => item.id == draft?.province_id);
  const city = cities.find((item) => item.id == draft?.city_id);
  const search = [province?.title, city?.title]
    .filter((part) => part && !address.includes(part))
    .concat(address.trim() ? [address.trim()] : [])
    .join(" ");
  const { addresses, isFetching, isDebouncing } = useMapAddressSearch(
    search,
    DEFAULT_CENTER,
    Boolean(draft?.id && address.trim() && !savedPoint && !selection.center) &&
      !isLoadingPlaces,
  );
  const match = addresses.find(
    (item) =>
      item.location?.y >= 24 &&
      item.location.y <= 40 &&
      item.location?.x >= 44 &&
      item.location.x <= 64,
  );
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
    setCenter,
    selectPoint,
    // A late address response must not move a pin the host has already moved.
    jumpTo: selection.center ? selection.jumpTo : initialPoint,
    hasMoved: selection.center !== null,
    isLocating: Boolean(address.trim()) && !savedPoint && !selection.center &&
      (isLoadingPlaces || isFetching || isDebouncing),
  };
};
