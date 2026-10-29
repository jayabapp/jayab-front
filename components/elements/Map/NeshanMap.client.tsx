"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/hooks/useTheme";

import type { NeshanMapProps } from "@/types/components/elements/map";
import type { MapStyleName } from "@/types/components/elements/map";

import "@neshan-maps-platform/maplibre-sdk/style.css";

import maplibregl from "@neshan-maps-platform/maplibre-sdk";

const STYLE_BASE_URL = "https://static.neshan.org/sdk/maplibre/styles";
const BOUNDS_PADDING_PX = 48;
const TILE_ERROR_LIMIT = 4;

const NIGHT_STYLE: Record<MapStyleName, string> = {
  light: "dark",
  monochrome_light: "monochrome_dark",
};

const styleUrl = (name: MapStyleName) => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return `${STYLE_BASE_URL}/${isDark ? NIGHT_STYLE[name] : name}.json`;
};

const NIGHT_GROUND: Record<
  string,
  { property: "background-color" | "fill-color"; token: string }
> = {
  background: { property: "background-color", token: "--c-surface" },
  water: { property: "fill-color", token: "--c-page" },
};

const tokenColor = (token: string) => {
  const channels = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return channels ? `rgb(${channels.split(/s+/).join(", ")})` : null;
};

const paintNightGround = (map: maplibregl.Map) => {
  for (const layer of map.getStyle()?.layers ?? []) {
    const ground =
      NIGHT_GROUND[layer.type === "background" ? "background" : layer.id];
    if (!ground || (layer.type !== "background" && layer.type !== "fill"))
      continue;
    const color = tokenColor(ground.token);
    if (color) map.setPaintProperty(layer.id, ground.property, color);
  }
};

const NeshanMap = ({
  zoom,
  center,
  bounds,
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
  const { resolved: theme } = useTheme();
  const slotRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const appliedStyleRef = useRef("");
  const initialRef = useRef({
    zoom,
    center,
    bounds,
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
    "CooperativeGesturesHandler.WindowsHelpText": t(
      "mapCooperativeHintDesktop",
    ),
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
    appliedStyleRef.current = styleUrl(initial.mapStyle);
    try {
      map = new maplibregl.Map({
        container,
        apiKey,
        style: appliedStyleRef.current,
        ...(initial.bounds
          ? {
              bounds: initial.bounds,
              fitBoundsOptions: { padding: BOUNDS_PADDING_PX, maxZoom: 15 },
            }
          : { center: initial.center, zoom: initial.zoom }),
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
    let hasStyle = false;
    let hasTile = false;
    let tileErrors = 0;
    map.on("style.load", () => {
      if (
        appliedStyleRef.current.includes("_dark") ||
        appliedStyleRef.current.endsWith("/dark.json")
      )
        paintNightGround(map);
    });
    map.once("style.load", () => {
      hasStyle = true;
    });
    map.on("data", (event) => {
      if (event.dataType === "source" && "tile" in event) hasTile = true;
    });
    map.on("error", () => {
      if (!hasStyle) fail();
      else if (!hasTile && ++tileErrors >= TILE_ERROR_LIMIT) fail();
    });
    mapRef.current = map;
    ready(map);
    return () => {
      mapRef.current = null;
      map.remove();
      container.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const next = styleUrl(mapStyle);
    if (next === appliedStyleRef.current) return;
    appliedStyleRef.current = next;
    map.setStyle(next, { diff: false });
  }, [mapStyle, theme]);

  return <div ref={slotRef} className={className ?? "size-full"} />;
};

export default NeshanMap;
