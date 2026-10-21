import type { SearchedLocation } from "@/types/features/map";

const normalize = (value: string) =>
  value
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[\u200c\u200d\u064b-\u065f]/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const describes = (item: SearchedLocation, place: string) => {
  const phrase = normalize(place);
  if (!phrase) return false;
  const text = normalize(
    [item.title, item.address, item.region, item.neighbourhood].join(" "),
  );
  return (
    ` ${text} `.includes(` ${phrase} `) ||
    (phrase.length >= 5 && text.replaceAll(" ", "").includes(phrase.replaceAll(" ", "")))
  );
};

const validPoint = (item: SearchedLocation) =>
  item.location?.y >= 24 &&
  item.location.y <= 40 &&
  item.location?.x >= 44 &&
  item.location.x <= 64;

const distanceKm = (a: SearchedLocation, b: SearchedLocation) => {
  const rad = Math.PI / 180;
  const lat1 = a.location.y * rad;
  const lat2 = b.location.y * rad;
  const lat = (b.location.y - a.location.y) * rad;
  const lng = (b.location.x - a.location.x) * rad;
  const h =
    Math.sin(lat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const findCityLocation = (
  results: SearchedLocation[],
  city: string,
  province: string,
) =>
  results.find(
    (item) =>
      validPoint(item) &&
      describes(item, city) &&
      (!province || describes(item, province)),
  ) ?? null;

export const findAddressNearCity = (
  results: SearchedLocation[],
  cityPoint: SearchedLocation,
  city: string,
  region: string,
  address: string,
) => {
  const placeTokens = new Set(normalize(`${city} ${region}`).split(" "));
  const streetTokens = normalize(address)
    .split(" ")
    .filter(
      (word) =>
        (word.length >= 3 || /^\d+$/.test(word)) &&
        !placeTokens.has(word) &&
        !["خیابان", "بلوار", "کوچه", "استان", "شهر"].includes(word),
    );

  return (
  results
    .filter(
      (item) =>
        validPoint(item) &&
        distanceKm(item, cityPoint) <= 35 &&
        (describes(item, city) || (region ? describes(item, region) : false)) &&
        (!region || describes(item, region)) &&
        (streetTokens.length === 0 || streetTokens.some((word) => describes(item, word))),
    )
    .sort((a, b) => distanceKm(a, cityPoint) - distanceKm(b, cityPoint))[0] ?? null
  );
};
