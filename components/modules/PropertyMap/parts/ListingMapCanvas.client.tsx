"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { APPROX_AREA_STYLE, MAP_COLORS, NeshanMap } from "@elements/Map";
import { createAreaLabelElement, createPinElement } from "@elements/Map";
import { FLIGHT_START_ZOOM, IRAN_CENTER } from "@features/map/constants/flight";
import { useOverlayBackButton } from "@/hooks/useOverlayBackButton";
import { prefersReducedMotion } from "@features/map/lib/map-support";
import { DESKTOP_MEDIA_QUERY } from "@features/map/constants/flight";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { trackListingEvent } from "@/helpers/listingAnalytics";
import { FLIGHT_END_ZOOM } from "@features/map/constants/flight";
import { circlePolygon } from "@features/map/lib/circle-polygon";
import { createPortal } from "react-dom";
import { useMapFlight } from "@features/map/hooks/useMapFlight";
import { useIsDesktop } from "@features/map/hooks/useIsDesktop";
import { Icon } from "@elements/Icon";

import type { ListingMapCanvasProps } from "@/types/components/modules/property-map";
import type { NeshanMapInstance } from "@/types/components/elements/map";
import type { MapFlightLanding } from "@/types/features/map";

import maplibregl from "@neshan-maps-platform/maplibre-sdk";
import _STRINGS from "@/utils/LocalStrings";

const AREA_SOURCE = "listing-approx-area";
const AREA_FILL_LAYER = `${AREA_SOURCE}-fill`;
const AREA_LINE_LAYER = `${AREA_SOURCE}-line`;
const AREA_FADE_MS = 400;

const CONTROL_CLASS =
  "absolute left-3 top-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white text-neutral-900 shadow-glass-sm transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

const ListingMapCanvas = ({
  lat,
  lng,
  mode,
  onError,
  radiusMeters,
}: ListingMapCanvasProps) => {
  const isDesktop = useIsDesktop();
  const [map, setMap] = useState<NeshanMapInstance | null>(null);
  const [landing, setLanding] = useState<MapFlightLanding | null>(null);
  const [isStyleReady, setIsStyleReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [camera] = useState<{
    animated: boolean;
    zoom: number;
    center: [number, number];
  }>(() => {
    if (prefersReducedMotion())
      return {
        animated: false,
        zoom: FLIGHT_END_ZOOM[mode],
        center: [lng, lat],
      };
    const isWide = window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
    return {
      animated: true,
      center: IRAN_CENTER,
      zoom: isWide ? FLIGHT_START_ZOOM.desktop : FLIGHT_START_ZOOM.mobile,
    };
  });
  const requestClose = useOverlayBackButton(isFullscreen, () =>
    setIsFullscreen(false),
  );
  useBodyScrollLock(isFullscreen);

  useMapFlight({
    map,
    containerRef,
    target: { lng, lat },
    endZoom: FLIGHT_END_ZOOM[mode],
    onLand: (result) => {
      setLanding(result);
      if (result.animated)
        trackListingEvent("listing_map_flight_completed", {
          mode,
          interrupted: result.interrupted,
        });
    },
  });

  useEffect(() => {
    if (!map) return;
    const markReady = () => setIsStyleReady(true);
    if (map.isStyleLoaded()) markReady();
    else map.once("style.load", markReady);
    return () => {
      map.off("style.load", markReady);
    };
  }, [map]);

  // Globe is only worth drawing while the camera is high above Iran; MapLibre
  // hands over to the flat map by itself as the flight zooms in.
  useEffect(() => {
    if (!map || !isStyleReady || !camera.animated) return;
    try {
      map.setProjection({ type: "globe" });
    } catch {
      // Older style specs keep the flat map; the flight still works.
    }
  }, [map, isStyleReady, camera.animated]);

  useEffect(() => {
    if (!map || !landing || mode !== "exact") return;
    const marker = new maplibregl.Marker({
      anchor: "bottom",
      element: createPinElement({ animate: landing.animated }),
    })
      .setLngLat([lng, lat])
      .addTo(map);
    return () => {
      marker.remove();
    };
  }, [map, landing, mode, lat, lng]);

  useEffect(() => {
    if (!map || !landing || mode !== "approx" || !isStyleReady) return;
    const fill = landing.animated ? 0 : APPROX_AREA_STYLE.fillOpacity;
    const line = landing.animated ? 0 : APPROX_AREA_STYLE.lineOpacity;
    map.addSource(AREA_SOURCE, {
      type: "geojson",
      data: circlePolygon(lng, lat, radiusMeters),
    });
    map.addLayer({
      id: AREA_FILL_LAYER,
      type: "fill",
      source: AREA_SOURCE,
      paint: {
        "fill-color": MAP_COLORS.areaFill,
        "fill-opacity": fill,
        "fill-opacity-transition": { duration: AREA_FADE_MS, delay: 0 },
      },
    });
    map.addLayer({
      id: AREA_LINE_LAYER,
      type: "line",
      source: AREA_SOURCE,
      paint: {
        "line-color": MAP_COLORS.areaLine,
        "line-width": APPROX_AREA_STYLE.lineWidth,
        "line-opacity": line,
        "line-opacity-transition": { duration: AREA_FADE_MS, delay: 0 },
      },
    });
    const label = createAreaLabelElement(_STRINGS.APPROXIMATE_AREA);
    label.style.opacity = landing.animated ? "0" : "1";
    label.style.transition = `opacity ${AREA_FADE_MS}ms ease-out`;
    const labelMarker = new maplibregl.Marker({ element: label })
      .setLngLat([lng, lat])
      .addTo(map);
    const frame = window.requestAnimationFrame(() => {
      map.setPaintProperty(
        AREA_FILL_LAYER,
        "fill-opacity",
        APPROX_AREA_STYLE.fillOpacity,
      );
      map.setPaintProperty(
        AREA_LINE_LAYER,
        "line-opacity",
        APPROX_AREA_STYLE.lineOpacity,
      );
      label.style.opacity = "1";
    });
    return () => {
      window.cancelAnimationFrame(frame);
      labelMarker.remove();
      try {
        if (map.getLayer(AREA_LINE_LAYER)) map.removeLayer(AREA_LINE_LAYER);
        if (map.getLayer(AREA_FILL_LAYER)) map.removeLayer(AREA_FILL_LAYER);
        if (map.getSource(AREA_SOURCE)) map.removeSource(AREA_SOURCE);
      } catch {
        // The map was already torn down with the section.
      }
    };
  }, [map, landing, mode, isStyleReady, lat, lng, radiusMeters]);

  // The layout wraps the page in a z-1 stacking context, so an in-place fixed
  // overlay would sit under the site header. Fullscreen renders into a body
  // portal and the map element itself moves there, keeping the one WebGL context.
  useLayoutEffect(() => {
    if (!map || !isFullscreen) return;
    const host = map.getContainer();
    const home = host.parentElement;
    fullscreenRef.current?.appendChild(host);
    return () => {
      home?.appendChild(host);
    };
  }, [map, isFullscreen]);

  useEffect(() => {
    if (!map) return;
    if (isDesktop && !isFullscreen) map.cooperativeGestures.enable();
    else map.cooperativeGestures.disable();
    const frame = window.requestAnimationFrame(() => map.resize());
    return () => window.cancelAnimationFrame(frame);
  }, [map, isDesktop, isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [isFullscreen, requestClose]);

  return (
    <div
      ref={containerRef}
      // Inline on phones the map is a preview (a tap opens fullscreen), so its zoom buttons are hidden.
      className="absolute inset-0 overflow-hidden bg-neutral-100 max-md:[&_.maplibregl-ctrl-top-right]:hidden md:rounded-20 md:border md:border-neutral-200"
    >
      <NeshanMap
        onError={onError}
        onMapReady={setMap}
        zoom={camera.zoom}
        center={camera.center}
        mapStyle="monochrome_light"
        cooperativeGestures={false}
        ariaLabel={_STRINGS.MAP_ARIA_LABEL}
        className="size-full"
      />
      {isFullscreen ? (
        <></>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label={_STRINGS.MAP_EXPAND}
            className={`${CONTROL_CLASS} hidden md:flex`}
          >
            <Icon name="expand" size={20} />
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label={_STRINGS.MAP_EXPAND}
            className="absolute inset-0 z-[5] cursor-pointer md:hidden"
          />
        </>
      )}
      {isFullscreen
        ? createPortal(
            <div
              ref={fullscreenRef}
              className="fixed inset-0 z-[1000] bg-white"
            >
              <button
                ref={closeRef}
                type="button"
                onClick={requestClose}
                aria-label={_STRINGS.MAP_COLLAPSE}
                className={`${CONTROL_CLASS} z-10`}
              >
                <Icon name="x" size={20} />
              </button>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};

export default ListingMapCanvas;
