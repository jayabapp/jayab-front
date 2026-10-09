"use client";

import {
  getServerSnapshot,
  getSnapshot,
  setThemeChoice,
  subscribe,
} from "@lib/theme/store.client";
import { useSyncExternalStore } from "react";

export const useTheme = () => ({
  ...useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot),
  setChoice: setThemeChoice,
});
