"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { FLIGHT, FLIGHT_START_DELAY_MS } from "../constants/flight";
import { FLIGHT_VISIBLE_THRESHOLD } from "../constants/flight";
import { LANDING_IDLE_TIMEOUT_MS } from "../constants/flight";
import { prefersReducedMotion } from "../lib/map-support";

import type { NeshanMapInstance } from "@/types/components/elements/map";
import type { MapFlightLanding } from "@/types/features/map";
import type { RefObject } from "react";

type TUseMapFlightOptions = {
  endZoom: number;
  map: NeshanMapInstance | null;
  target: { lng: number; lat: number };
  containerRef: RefObject<HTMLElement | null>;
  onLand: (landing: MapFlightLanding) => void;
};

const INTERACTION_EVENTS = ["mousedown", "touchstart", "wheel"] as const;

export const useMapFlight = ({
  map,
  target,
  onLand,
  endZoom,
  containerRef,
}: TUseMapFlightOptions) => {
  const [isVisible, setIsVisible] = useState(false);
  const [wasVisible, setWasVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const startedRef = useRef(false);
  const disposeRef = useRef<(() => void) | null>(null);
  const land = useEffectEvent(onLand);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setWasVisible(true);
      },
      { threshold: FLIGHT_VISIBLE_THRESHOLD },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    if (!map) return;
    const markReady = () => setIsReady(true);
    map.once("idle", markReady);
    return () => {
      map.off("idle", markReady);
    };
  }, [map]);

  useEffect(() => {
    if (!map || startedRef.current) return;
    const jump = prefersReducedMotion() || (wasVisible && !isVisible);
    if (!jump && !(isReady && isVisible)) return;

    startedRef.current = true;
    if (jump) {
      map.jumpTo({ center: [target.lng, target.lat], zoom: endZoom });
      land({ animated: false, interrupted: false });
      return;
    }

    const node = containerRef.current;
    let interrupted = false;
    const interrupt = () => {
      interrupted = true;
      map.stop();
    };
    const detach = () =>
      INTERACTION_EVENTS.forEach((name) =>
        node?.removeEventListener(name, interrupt),
      );
    // Land once the destination tiles are drawn, so the pin drops onto streets and not a blank map.
    const finish = () => {
      detach();
      const settle = () => {
        window.clearTimeout(fallback);
        map.off("idle", settle);
        disposeRef.current = null;
        land({ animated: true, interrupted });
      };
      const fallback = window.setTimeout(settle, LANDING_IDLE_TIMEOUT_MS);
      disposeRef.current = () => {
        window.clearTimeout(fallback);
        map.off("idle", settle);
      };
      if (map.loaded()) settle();
      else map.once("idle", settle);
    };
    INTERACTION_EVENTS.forEach((name) =>
      node?.addEventListener(name, interrupt, { passive: true }),
    );
    const timer = window.setTimeout(() => {
      map.once("moveend", finish);
      map.flyTo({
        center: [target.lng, target.lat],
        zoom: endZoom,
        ...FLIGHT,
        essential: false,
      });
    }, FLIGHT_START_DELAY_MS);
    disposeRef.current = () => {
      window.clearTimeout(timer);
      map.off("moveend", finish);
      detach();
    };
  }, [
    map,
    isReady,
    isVisible,
    wasVisible,
    endZoom,
    target.lat,
    target.lng,
    containerRef,
  ]);

  useEffect(() => () => disposeRef.current?.(), []);
};
