"use client";

import { useEffect, useState } from "react";
import { createPinElement } from "./createPinElement";
import { useTranslations } from "next-intl";

import type { NeshanMapInstance } from "@/types/components/elements/map";
import type { MapViewerProps } from "@/types/components/elements/map";

import maplibregl from "@neshan-maps-platform/maplibre-sdk";
import NeshanMap from "./NeshanMap.client";

const VIEWER_ZOOM = 16;

const MapViewer = ({
  center,
  onError,
  containerClass,
  jumpToGivenPlace,
  businessMarkersData,
}: MapViewerProps) => {
  const t = useTranslations("common");

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
        onError={onError}
        zoom={VIEWER_ZOOM}
        cooperativeGestures
        onMapReady={setMap}
        center={initialCenter}
        className="map size-full"
        ariaLabel={t("mapAriaLabel")}
      />
    </div>
  );
};

export default MapViewer;
