"use client";

import { useEffect, useState } from "react";

export const useDebouncedValue = <T>(value: T, delay = 400): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), Math.max(0, delay));
    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
};
