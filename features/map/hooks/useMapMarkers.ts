"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { createPricePinElement } from "@elements/Map";
import { createClusterElement } from "@elements/Map";
import { setMarkerState } from "@elements/Map";
import { itemKey } from "../lib/map-camera";

import type { NeshanMapInstance } from "@/types/components/elements/map";
import type { MarkerDescription } from "@/types/features/map";
import type { MapPropertyItem } from "@/api_services/property/property.interface";
import type { MapClusterItem } from "@/api_services/property/property.interface";
import type { MapItem } from "@/api_services/property/property.interface";

import maplibregl from "@neshan-maps-platform/maplibre-sdk";

type Entry = {
  item: MapItem;
  signature: string;
  element: HTMLElement;
  marker: maplibregl.Marker;
};

type Options = {
  items: readonly MapItem[];
  hoveredId: number | null;
  selectedId: number | null;
  map: NeshanMapInstance | null;
  describe: (item: MapItem) => MarkerDescription;
  onCluster: (item: MapClusterItem) => void;
  onProperty: (item: MapPropertyItem) => void;
};

export const useMapMarkers = ({
  map,
  items,
  describe,
  onCluster,
  hoveredId,
  selectedId,
  onProperty,
}: Options) => {
  const entries = useRef(new Map<string, Entry>());
  const clusterClicked = useEffectEvent(onCluster);
  const propertyClicked = useEffectEvent(onProperty);

  useEffect(() => {
    const current = entries.current;
    return () => {
      current.forEach(({ marker }) => marker.remove());
      current.clear();
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const host = map.getCanvasContainer();
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element).closest<HTMLElement>(
        "[data-map-key]",
      );
      const entry = target && entries.current.get(target.dataset.mapKey ?? "");
      if (!entry) return;
      event.stopPropagation();
      if (entry.item.type === "cluster") clusterClicked(entry.item);
      else propertyClicked(entry.item);
    };
    host.addEventListener("click", onClick);
    return () => host.removeEventListener("click", onClick);
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const current = entries.current;
    const wanted = new Set(items.map(itemKey));
    for (const [key, entry] of current) {
      if (wanted.has(key)) continue;
      entry.marker.remove();
      current.delete(key);
    }

    for (const item of items) {
      const key = itemKey(item);
      const description = describe(item);
      const signature = JSON.stringify(description);
      const existing = current.get(key);
      if (existing?.signature === signature) {
        existing.item = item;
        existing.marker.setLngLat(
          item.type === "cluster"
            ? [item.lng, item.lat]
            : [item.location.lng, item.location.lat],
        );
        continue;
      }
      existing?.marker.remove();

      const isCluster = item.type === "cluster";
      const element = isCluster
        ? createClusterElement({ key, count: item.count, ...description })
        : createPricePinElement({ key, ...description });
      const marker = new maplibregl.Marker({
        element,
        anchor: isCluster ? "center" : "bottom",
      })
        .setLngLat(
          isCluster
            ? [item.lng, item.lat]
            : [item.location.lng, item.location.lat],
        )
        .addTo(map);
      current.set(key, { item, signature, element, marker });
    }
  }, [map, items, describe]);

  useEffect(() => {
    entries.current.forEach(({ item, element }) => {
      const id = item.type === "property" ? item.id : null;
      setMarkerState(
        element,
        id !== null && id === selectedId
          ? "selected"
          : id !== null && id === hoveredId
            ? "hover"
            : "idle",
      );
    });
  }, [hoveredId, selectedId, items, describe, map]);
};
