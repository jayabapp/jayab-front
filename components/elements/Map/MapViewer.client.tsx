"use client";

import { useEffect, useState } from "react";
import { createPinElement } from "./createPinElement";

import type { NeshanMapInstance } from "@/types/components/elements/map";
import type { MapViewerProps } from "@/types/components/elements/map";

import maplibregl from "@neshan-maps-platform/maplibre-sdk";
import NeshanMap from "./NeshanMap.client";
import _STRINGS from "@/utils/LocalStrings";

const VIEWER_ZOOM = 16;

const MapViewer = ({
  center,
  onError,
  containerClass,
  jumpToGivenPlace,
  businessMarkersData,
}: MapViewerProps) => {
  const [map, setMap] = useState<NeshanMapInstance | null>(null);
  const [initialCenter] = useState<[number, number]>(() => [
    center[0],
    center[1],
  ]);

  useEffect(() => {
    if (!map || !businessMarkersData) return;
    const markers = businessMarkersData.map((item) =>
      new maplibregl.Marker({ element: createPinElement(), anchor: "bottom" })
        .setLngLat([Number(item.lng), Number(item.lat)])
        .addTo(map),
    );
    return () => markers.forEach((marker) => marker.remove());
  }, [map, businessMarkersData]);

  useEffect(() => {
    const lat = Number(jumpToGivenPlace?.lat);
    const lng = Number(jumpToGivenPlace?.lng);
    if (!map || !lat || !lng) return;
    map.flyTo({ center: [lng, lat], essential: true });
  }, [map, jumpToGivenPlace]);

  return (
    <div className={`map-wrap relative ${containerClass ?? ""}`}>
      <NeshanMap
        cooperativeGestures
        onError={onError}
        onMapReady={setMap}
        zoom={VIEWER_ZOOM}
        center={initialCenter}
        ariaLabel={_STRINGS.MAP_ARIA_LABEL}
        className="map size-full"
      />
    </div>
  );
};

export default MapViewer;
