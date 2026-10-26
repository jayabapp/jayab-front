"use client";

import { createContext, useContext, useEffect } from "react";
import { useMemo, useRef, useState } from "react";
import { DISCOVERY_MAP_ENABLED } from "@features/map/constants/discovery-map";
import { useSyncExternalStore } from "react";

import type { Dispatch, ReactNode, SetStateAction } from "react";

export type MapView = {
  zoom: number;
  area: string | null;
  destination: string;
  center: [number, number];
};

type HoverStore = {
  get: () => number | null;
  set: (id: number | null) => void;
  subscribe: (listener: () => void) => () => void;
};

type ViewStore = {
  get: () => MapView | null;
  set: (view: MapView) => void;
};

type DiscoveryMapValue = {
  view: ViewStore;
  hover: HoverStore;
  isEnabled: boolean;
  autoSearch: boolean;
  isSheetOpen: boolean;
  isColumnOpen: boolean;
  selectedId: number | null;
  setAutoSearch: Dispatch<SetStateAction<boolean>>;
  setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
  setIsColumnOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
};

const noop = () => {};
const OFF: DiscoveryMapValue = {
  isEnabled: false,
  hover: { get: () => null, set: noop, subscribe: () => noop },
  view: { get: () => null, set: noop },
  isColumnOpen: false,
  isSheetOpen: false,
  autoSearch: false,
  selectedId: null,
  setIsColumnOpen: noop,
  setIsSheetOpen: noop,
  setAutoSearch: noop,
  setSelectedId: noop,
};

const DiscoveryMapContext = createContext<DiscoveryMapValue>(OFF);

let carriedAutoSearch = false;

export const DiscoveryMapProvider = ({
  children,
  hasMapArea,
}: {
  children: ReactNode;
  hasMapArea: boolean;
}) => {
  const [isColumnOpen, setIsColumnOpen] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [autoSearch, setAutoSearch] = useState(
    () => hasMapArea && carriedAutoSearch,
  );
  useEffect(() => {
    carriedAutoSearch = autoSearch;
  }, [autoSearch]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [view] = useState<ViewStore>(() => {
    let current: MapView | null = null;
    return {
      get: () => current,
      set: (next) => {
        current = next;
      },
    };
  });
  const [hover] = useState<HoverStore>(() => {
    let current: number | null = null;
    const listeners = new Set<() => void>();
    return {
      get: () => current,
      set: (id) => {
        if (id === current) return;
        current = id;
        listeners.forEach((listener) => listener());
      },
      subscribe: (listener) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
    };
  });

  const hadMapArea = useRef(hasMapArea);
  useEffect(() => {
    if (hadMapArea.current && !hasMapArea) setAutoSearch(false);
    hadMapArea.current = hasMapArea;
  }, [hasMapArea]);

  const value = useMemo<DiscoveryMapValue>(
    () => ({
      view,
      hover,
      autoSearch,
      selectedId,
      isSheetOpen,
      isColumnOpen,
      setAutoSearch,
      setSelectedId,
      setIsSheetOpen,
      setIsColumnOpen,
      isEnabled: DISCOVERY_MAP_ENABLED,
    }),
    [autoSearch, hover, isColumnOpen, isSheetOpen, selectedId, view],
  );

  return (
    <DiscoveryMapContext.Provider value={value}>
      {children}
    </DiscoveryMapContext.Provider>
  );
};

export const useDiscoveryMap = () => useContext(DiscoveryMapContext);

export const useHoveredPropertyId = () => {
  const { hover } = useDiscoveryMap();
  return useSyncExternalStore(hover.subscribe, hover.get, () => null);
};
