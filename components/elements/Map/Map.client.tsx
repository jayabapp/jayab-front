"use client";

import type { InteractiveMapProps } from "@/types/components/elements/map";
import type { NeshanMapInstance } from "@/types/components/elements/map";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import NeshanMap from "./NeshanMap.client";
import _STRINGS from "@/utils/LocalStrings";
import Image from "next/image";

const INITIAL_ZOOM = 15;

const Map = ({
  center,
  onError,
  setCenter,
  jumpToState,
  disableCenter,
  containerClass,
}: InteractiveMapProps) => {
  const [map, setMap] = useState<NeshanMapInstance | null>(null);
  const [initialCenter] = useState<[number, number]>(() => [
    center[0],
    center[1],
  ]);
  const hasJumpedRef = useRef(false);
  const updateCenter = useEffectEvent((nextCenter: number[]) => {
    setCenter?.(nextCenter);
  });

  useEffect(() => {
    if (!map) return;
    const handleMoveEnd = () => {
      const { lng, lat } = map.getCenter();
      updateCenter([lng, lat]);
    };
    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !jumpToState) return;
    const target = {
      center: [Number(jumpToState.lng), Number(jumpToState.lat)] as [
        number,
        number,
      ],
    };
    // A saved pin restored on load should appear in place; only later searches fly.
    if (hasJumpedRef.current) map.flyTo({ ...target, essential: true });
    else map.jumpTo(target);
    hasJumpedRef.current = true;
  }, [map, jumpToState]);

  return (
    <div className="map-wrap relative">
      <NeshanMap
        showGeolocate
        onError={onError}
        onMapReady={setMap}
        zoom={INITIAL_ZOOM}
        center={initialCenter}
        ariaLabel={_STRINGS.MAP_ARIA_LABEL}
        className={`map ${containerClass || "w-screen aspect-square"}`}
      />
      {!disableCenter ? (
        <Image
          alt=""
          width={32}
          height={32}
          style={{ transform: "translate(-50%,-50%)" }}
          src="/assets/icons/addresses/location_center.svg"
          className="pointer-events-none absolute w-8 aspect-square top-1/2 left-1/2"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Map;
