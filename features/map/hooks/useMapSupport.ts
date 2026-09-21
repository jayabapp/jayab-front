"use client";

import { useSyncExternalStore } from "react";
import { canRenderNeshanMap } from "../lib/map-support";

const subscribe = () => () => {};

export const useMapSupport = () =>
  useSyncExternalStore<boolean | null>(
    subscribe,
    canRenderNeshanMap,
    () => null,
  );
