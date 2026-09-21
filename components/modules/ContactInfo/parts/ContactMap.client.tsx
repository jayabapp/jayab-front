"use client";

import { googleDirectionsHref } from "@/helpers/map.link";
import { useMemo, useState } from "react";
import { MapFallbackCard } from "@elements/MapFallback";
import { useMapSupport } from "@features/map/hooks/useMapSupport";

import type { ContactMapProps } from "@/types/components/modules/contact-us";

import Skeleton from "@elements/Skeleton/Skeleton";
import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@elements/Map").then((module) => module.MapViewer),
  {
    loading: () => <Skeleton className="size-full rounded-md" />,
    ssr: false,
  },
);

const ContactMap = ({ latitude, longitude }: ContactMapProps) => {
  const isSupported = useMapSupport();
  const [hasFailed, setHasFailed] = useState(false);
  const markers = useMemo(
    () => [{ lat: latitude, lng: longitude }],
    [latitude, longitude],
  );

  if (isSupported === null)
    return <Skeleton className="size-full rounded-md" />;
  if (!isSupported || hasFailed)
    return (
      <MapFallbackCard
        className="size-full"
        message={_STRINGS.MAP_BROWSER_UNSUPPORTED}
        actionLabel={_STRINGS.VIEW_ON_MAP}
        href={googleDirectionsHref({ latitude, longitude })}
      />
    );
  return (
    <Map
      center={[longitude, latitude]}
      businessMarkersData={markers}
      onError={() => setHasFailed(true)}
    />
  );
};

export default ContactMap;
