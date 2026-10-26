import { localizeDigits } from "@/helpers/intl/digits";
import { formatNumber } from "@/helpers/intl/number";

import type { PublicMapPoint } from "@/api_services/property/property.interface";
import type { DisplayLocale } from "@/helpers/intl/digits";
import type { MapItem } from "@/api_services/property/property.interface";
import type { Bbox } from "@features/properties/lib/bbox";

const MILLION = 1_000_000;

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

export const pinPriceLabel = (
  price: number | null,
  locale: DisplayLocale,
  words: { million: string; fallback: string },
): string => {
  if (price === null || !Number.isFinite(price) || price <= 0)
    return words.fallback;
  if (price < MILLION) return formatNumber(Math.round(price), locale);
  const millions = Math.round((price / MILLION) * 10) / 10;
  const text = String(millions).replace(".", locale === "ar" ? "٫" : ".");
  return `${localizeDigits(text, locale)} ${words.million}`;
};

const DESTINATION_KEYS = ["cities", "provinces", "province_id", "regions"];

export const destinationKey = (query: Record<string, unknown>): string =>
  DESTINATION_KEYS.map((key) => `${query[key] ?? ""}`).join("|");

export const itemKey = (item: MapItem) =>
  item.type === "cluster" ? `c:${item.id}` : `p:${item.id}`;
