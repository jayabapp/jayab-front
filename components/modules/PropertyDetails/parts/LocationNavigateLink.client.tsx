"use client";

import { googleDirectionsHref } from "@/helpers/map.link";
import { useSyncExternalStore } from "react";

import type { LocationNavigateLinkProps } from "@/types/components/modules/property-details";

import mapRedirectHelper from "@/helpers/map.link";

import _STRINGS from "@/utils/LocalStrings";

const subscribe = () => () => {};

const LocationNavigateLink = ({
  latitude,
  longitude,
  className = "",
}: LocationNavigateLinkProps) => {
  const href = useSyncExternalStore(
    subscribe,
    () => mapRedirectHelper({ latitude, longitude }),
    () => googleDirectionsHref({ latitude, longitude }),
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-11 cursor-pointer items-center justify-center rounded-full border border-neutral-300 px-5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${className}`}
    >
      {_STRINGS.NAVIGATE}
    </a>
  );
};

export default LocationNavigateLink;
