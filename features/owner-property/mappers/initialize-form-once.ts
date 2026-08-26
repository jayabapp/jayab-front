import type { MutableRefObject } from "react";

export const initializeFormOnce = <T>(
  initializedFor: MutableRefObject<string | null>,
  propertyId: string | number,
  isDirty: boolean,
  value: T | undefined,
  map: (value: T) => void,
) => {
  const id = String(propertyId);
  if (!value || isDirty || initializedFor.current === id) return;
  map(value);
  initializedFor.current = id;
};
