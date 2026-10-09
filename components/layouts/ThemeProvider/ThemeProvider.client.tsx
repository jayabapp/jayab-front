"use client";

import { startThemeSync } from "@lib/theme/store.client";
import { useEffect } from "react";

import type { ThemeProviderProps } from "@/types/components/layouts/theme-provider";

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  useEffect(startThemeSync, []);
  return <>{children}</>;
};

export default ThemeProvider;
