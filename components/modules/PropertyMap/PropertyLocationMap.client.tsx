"use client";

import { useEffect, useState } from "react";
import { useReverseGeocode } from "@features/map/hooks/useReverseGeocode";
import { MapFallbackCard } from "@elements/MapFallback";
import { useMapSupport } from "@features/map/hooks/useMapSupport";

import type { PropertyLocationMapProps } from "@/types/components/modules/property-map";

import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("@elements/Map").then((module) => module.InteractiveMap),
  { ssr: false },
);

const PropertyLocationMap = ({
  center,
  setCenter,
  jumpToState,
  disableCenter,
  containerClass,
  setCenterAddress,
  setCenterAddressLoading,
}: PropertyLocationMapProps) => {
  const isSupported = useMapSupport();
  const [hasFailed, setHasFailed] = useState(false);
  const isMapUnavailable = isSupported === false || hasFailed;
  const reverseGeocode = useReverseGeocode(
    center[0],
    center[1],
    Boolean(setCenterAddress),
  );

  useEffect(() => {
    setCenterAddressLoading?.(reverseGeocode.isFetching);
  }, [reverseGeocode.isFetching, setCenterAddressLoading]);

  useEffect(() => {
    if (reverseGeocode.data !== undefined) {
      setCenterAddress?.(reverseGeocode.data);
    }
  }, [reverseGeocode.data, setCenterAddress]);

  useEffect(() => {
    if (!isMapUnavailable || !jumpToState) return;
    setCenter?.([Number(jumpToState.lng), Number(jumpToState.lat)]);
  }, [isMapUnavailable, jumpToState, setCenter]);

  if (isMapUnavailable)
    return (
      <MapFallbackCard
        className="size-full"
        message={_STRINGS.MAP_PICK_UNSUPPORTED}
      />
    );
  if (isSupported === null) return <></>;
  return (
    <InteractiveMap
      center={center}
      setCenter={setCenter}
      jumpToState={jumpToState}
      disableCenter={disableCenter}
      containerClass={containerClass}
      onError={() => setHasFailed(true)}
    />
  );
};

export default PropertyLocationMap;
