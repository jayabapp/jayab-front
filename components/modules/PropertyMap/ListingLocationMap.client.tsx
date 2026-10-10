"use client";

import { useEffect, useRef, useState } from "react";
import { MAP_LAZY_ROOT_MARGIN } from "@features/map/constants/flight";
import { googleDirectionsHref } from "@/helpers/map.link";
import { useTranslations } from "next-intl";
import { MapFallbackCard } from "@elements/MapFallback";
import { useMapSupport } from "@features/map/hooks/useMapSupport";

import type { ListingLocationMapProps } from "@/types/components/modules/property-map";

import Skeleton from "@elements/Skeleton/Skeleton";
import dynamic from "next/dynamic";

const ListingMapCanvas = dynamic(
  () => import("./parts/ListingMapCanvas.client"),
  { ssr: false, loading: () => <Skeleton className="absolute inset-0" /> },
);

const ListingLocationMap = ({
  latitude,
  longitude,
  approxLocation,
}: ListingLocationMapProps) => {
  const t = useTranslations("common");

  const rootRef = useRef<HTMLDivElement>(null);
  const isSupported = useMapSupport();
  const [isNear, setIsNear] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const hasExact = Boolean(latitude && longitude);
  const target = hasExact
    ? { lat: Number(latitude), lng: Number(longitude), radius: 0 }
    : approxLocation
      ? {
          lat: approxLocation.lat,
          lng: approxLocation.lng,
          radius: approxLocation.radius_m,
        }
      : null;

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !isSupported || isNear) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNear(true);
        observer.disconnect();
      },
      { rootMargin: MAP_LAZY_ROOT_MARGIN },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isSupported, isNear]);

  if (!target) return null;
  return (
    <div ref={rootRef} className="relative -mx-3 h-64 md:mx-0 md:h-[22rem]">
      {isSupported === false || hasFailed ? (
        <MapFallbackCard
          className="size-full"
          message={t("mapBrowserUnsupported")}
          actionLabel={hasExact ? t("viewOnMap") : undefined}
          href={
            hasExact
              ? googleDirectionsHref({
                  latitude: target.lat,
                  longitude: target.lng,
                })
              : undefined
          }
        />
      ) : isNear ? (
        <ListingMapCanvas
          lat={target.lat}
          lng={target.lng}
          radiusMeters={target.radius}
          onError={() => setHasFailed(true)}
          mode={hasExact ? "exact" : "approx"}
        />
      ) : (
        <Skeleton className="absolute inset-0 md:rounded-20" />
      )}
    </div>
  );
};

export default ListingLocationMap;
