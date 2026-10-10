"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { useTranslations } from "next-intl";

import type { NeshanMapProps } from "@/types/components/elements/map";

import "@neshan-maps-platform/maplibre-sdk/style.css";

import maplibregl from "@neshan-maps-platform/maplibre-sdk";

const STYLE_BASE_URL = "https://static.neshan.org/sdk/maplibre/styles";

const NeshanMap = ({
  zoom,
  center,
  onError,
  className,
  ariaLabel,
  onMapReady,
  mapStyle = "light",
  showNavigation = true,
  showGeolocate = false,
  cooperativeGestures = false,
}: NeshanMapProps) => {
  const t = useTranslations("common");
  const slotRef = useRef<HTMLDivElement>(null);
  const initialRef = useRef({
    zoom,
    center,
    ariaLabel,
    mapStyle,
    showNavigation,
    showGeolocate,
    cooperativeGestures,
  });
  const ready = useEffectEvent((map: maplibregl.Map) => onMapReady?.(map));
  const fail = useEffectEvent(() => onError?.());
  const mapLocale = useEffectEvent(() => ({
    "NavigationControl.ZoomIn": t("mapZoomIn"),
    "NavigationControl.ZoomOut": t("mapZoomOut"),
    "NavigationControl.ResetBearing": t("mapResetBearing"),
    "GeolocateControl.FindMyLocation": t("mapFindMyLocation"),
    "CooperativeGesturesHandler.WindowsHelpText": t("mapCooperativeHintDesktop"),
    "CooperativeGesturesHandler.MacHelpText": t("mapCooperativeHintMac"),
    "CooperativeGesturesHandler.MobileHelpText": t("mapCooperativeHintMobile"),
  }));

  useEffect(() => {
    const slot = slotRef.current;
    const apiKey = process.env.NEXT_PUBLIC_NESHAN_MAP_KEY;
    if (!slot || !apiKey) {
      if (!apiKey) fail();
      return;
    }

    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";
    slot.appendChild(container);
    const initial = initialRef.current;
    if (initial.ariaLabel) {
      container.setAttribute("role", "region");
      container.setAttribute("aria-label", initial.ariaLabel);
    }
    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        apiKey,
        style: `${STYLE_BASE_URL}/${initial.mapStyle}.json`,
        center: initial.center,
        zoom: initial.zoom,
        minZoom: 1.5,
        maxZoom: 19,
        cooperativeGestures: initial.cooperativeGestures,
        locale: mapLocale(),
      });
    } catch {
      container.remove();
      fail();
      return;
    }
    if (initial.showNavigation)
      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right",
      );
    if (initial.showGeolocate)
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }),
        "top-right",
      );
    ready(map);
    return () => {
      map.remove();
      container.remove();
    };
  }, []);

  return <div ref={slotRef} className={className ?? "size-full"} />;
};

export default NeshanMap;
