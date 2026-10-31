import { formatListingPriceFor } from "@/helpers/intl/number";

import type { PublicMapPoint } from "@/api_services/property/property.interface";
import type { DisplayLocale } from "@/helpers/intl/digits";
import type { MapItem } from "@/api_services/property/property.interface";
import type { Bbox } from "@features/properties/lib/bbox";

export const DEFAULT_MAP_BOUNDS: Bbox = [44.0, 25.0, 63.5, 39.8];

type Located = { public_location?: PublicMapPoint | null };

export const boundsOfPoints = (
  points: readonly { lat: number; lng: number }[],
): Bbox | null => {
  if (points.length === 0) return null;
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const { lat, lng } of points) {
    west = Math.min(west, lng);
    south = Math.min(south, lat);
    east = Math.max(east, lng);
    north = Math.max(north, lat);
  }
  return [west, south, east, north];
};

export const publicPoints = (properties: readonly Located[]) =>
  properties.flatMap((property) =>
    property.public_location ? [property.public_location] : [],
  );

export type PinPriceUnit = "toman" | "thousand" | "million" | "billion";

const PRICE_SCALES: readonly [number, PinPriceUnit][] = [
  [1e9, "billion"],
  [1e6, "million"],
  [1e3, "thousand"],
];
const DECIMAL_MARK: Record<DisplayLocale, string> = {
  fa: "٫",
  ar: "٫",
  en: ".",
};

// A short amount for the pin: "۱٫۵۹" of a unit, two decimals at most. The caller words the
// unit ("میلیون ت"). A display string only; the full price stays in the pin's title.
export const pinPrice = (
  price: number | null,
  locale: DisplayLocale,
): { unit: PinPriceUnit; value: string } | null => {
  if (price === null || !Number.isFinite(price) || price <= 0) return null;
  let unit: PinPriceUnit = "toman";
  let scaled = Math.round(price);
  for (const [size, name] of PRICE_SCALES) {
    const candidate = Math.round((price / size) * 100) / 100;
    if (candidate < 1) continue;
    unit = name;
    scaled = candidate;
    break;
  }
  const [whole, fraction] = String(scaled).split(".");
  const value = formatListingPriceFor(Number(whole), locale);
  return {
    unit,
    value: fraction
      ? `${value}${DECIMAL_MARK[locale]}${formatListingPriceFor(fraction, locale)}`
      : value,
  };
};

const DESTINATION_KEYS = ["cities", "provinces", "province_id", "regions"];

export const destinationKey = (query: Record<string, unknown>): string =>
  DESTINATION_KEYS.map((key) => `${query[key] ?? ""}`).join("|");

export const itemKey = (item: MapItem) =>
  item.type === "cluster" ? `c:${item.id}` : `p:${item.id}`;
