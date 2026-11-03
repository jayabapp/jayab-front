"use client";

import {
  appendSearchHistory,
  getSearchHistorySnapshot,
  getServerSearchHistorySnapshot,
  removeSearchHistoryEntry,
  subscribeSearchHistory,
} from "@features/search/lib/search-history";
import { useSyncExternalStore } from "react";

export const useSearchHistory = () => {
  const entries = useSyncExternalStore(
    subscribeSearchHistory,
    getSearchHistorySnapshot,
    getServerSearchHistorySnapshot,
  );

  return { entries, forget: removeSearchHistoryEntry, remember: appendSearchHistory };
};
