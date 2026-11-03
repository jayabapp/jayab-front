"use client";

import { DESKTOP_MEDIA_QUERY } from "../constants/flight";
import { useSyncExternalStore } from "react";

const subscribe = (notify: () => void) => {
  const query = window.matchMedia(DESKTOP_MEDIA_QUERY);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

export const useIsDesktop = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_MEDIA_QUERY).matches,
    () => false,
  );
