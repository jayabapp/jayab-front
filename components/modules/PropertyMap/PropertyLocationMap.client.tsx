"use client";

import type { PropertyLocationMapProps } from "@/types/components/modules/property-map";
import { useReverseGeocode } from "@features/map/hooks/useReverseGeocode";
import { InteractiveMap } from "@elements/Map";
import { useEffect } from "react";

const PropertyLocationMap = ({
  center,
  setCenter,
  jumpToState,
  disableCenter,
  containerClass,
  setCenterAddress,
  setCenterAddressLoading,
}: PropertyLocationMapProps) => {
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

  return (
    <InteractiveMap
      center={center}
      setCenter={setCenter}
      jumpToState={jumpToState}
      disableCenter={disableCenter}
      containerClass={containerClass}
    />
  );
};

export default PropertyLocationMap;
