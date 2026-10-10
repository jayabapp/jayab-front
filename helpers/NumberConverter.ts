import { normalizeDigits } from "./intl/digits";

export const p2e = (s: string | number): string => {
  if (!s) return "";
  return normalizeDigits(`${s}`);
};
