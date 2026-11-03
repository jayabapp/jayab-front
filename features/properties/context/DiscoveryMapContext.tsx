"use client";

import { createContext, useContext, useEffect } from "react";
import { DISCOVERY_MAP_ENABLED } from "@features/map/constants/discovery-map";
import { useSyncExternalStore } from "react";
import { useMemo, useState } from "react";
import { useCallback } from "react";

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
  searchScope: string;
  view: ViewStore;
  hover: HoverStore;
  isEnabled: boolean;
  isColumnOpen: boolean;
  selectedId: number | null;
  setIsColumnOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
};

const noop = () => {};
const OFF: DiscoveryMapValue = {
  searchScope: "",
  isEnabled: false,
  hover: { get: () => null, set: noop, subscribe: () => noop },
  view: { get: () => null, set: noop },
  isColumnOpen: false,
  selectedId: null,
  setIsColumnOpen: noop,
  setSelectedId: noop,
};

const DiscoveryMapContext = createContext<DiscoveryMapValue>(OFF);

export const DiscoveryMapProvider = ({
  children,
  searchScope,
}: {
  children: ReactNode;
  searchScope: string;
}) => {
  const [isColumnOpen, setIsColumnOpen] = useState(true);
  const [selection, setSelection] = useState<{
    scope: string;
    id: number | null;
  }>({
    scope: searchScope,
    id: null,
  });
  const selectedId = selection.scope === searchScope ? selection.id : null;
  const setSelectedId = useCallback<Dispatch<SetStateAction<number | null>>>(
    (next) =>
      setSelection((current) => ({
        scope: searchScope,
        id:
          typeof next === "function"
            ? next(current.scope === searchScope ? current.id : null)
            : next,
      })),
    [searchScope],
  );
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

  useEffect(() => hover.set(null), [hover, searchScope]);

  const value = useMemo<DiscoveryMapValue>(
    () => ({
      searchScope,
      view,
      hover,
      selectedId,
      isColumnOpen,
      setSelectedId,
      setIsColumnOpen,
      isEnabled: DISCOVERY_MAP_ENABLED,
    }),
    [hover, isColumnOpen, selectedId, setSelectedId, searchScope, view],
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
