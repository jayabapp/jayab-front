import { formatListingPriceFor } from "@/helpers/intl/number";
import { formatNumber } from "@/helpers/intl/number";

import type { PublicMapPoint } from "@/api_services/property/property.interface";
import type { DisplayLocale } from "@/helpers/intl/digits";
import type { MapItem } from "@/api_services/property/property.interface";
import type { Bbox } from "@features/properties/lib/bbox";

// How a pin groups thousands in each language: "۱/۵۰۰/۰۰۰" in fa (what the product
// asked for), the Arabic separator in ar, a comma in en.
const PIN_GROUP_SEPARATOR: Record<DisplayLocale, string> = {
  fa: "/",
  ar: "٬",
  en: ",",
};

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

// The whole nightly amount in the language's own digits, grouped, with a short currency
// mark ("۱/۵۰۰/۰۰۰T"). A display string only; nothing here is fed back into a query.
export const pinPriceLabel = (
  price: number | null,
  locale: DisplayLocale,
  words: { currency: string; fallback: string },
): string => {
  if (price === null || !Number.isFinite(price) || price <= 0)
    return words.fallback;
  const grouped =
    locale === "ar"
      ? formatNumber(Math.round(price), locale)
      : formatListingPriceFor(Math.round(price), locale);
  return `${grouped.replace(/[,٬]/g, PIN_GROUP_SEPARATOR[locale])}${words.currency}`;
};

const DESTINATION_KEYS = ["cities", "provinces", "province_id", "regions"];

export const destinationKey = (query: Record<string, unknown>): string =>
  DESTINATION_KEYS.map((key) => `${query[key] ?? ""}`).join("|");

export const itemKey = (item: MapItem) =>
  item.type === "cluster" ? `c:${item.id}` : `p:${item.id}`;
