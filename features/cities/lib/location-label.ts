import {
  parseIdList,
  resolveQueryCities,
  resolveQueryProvinces,
} from "@features/cities/lib/city-selection";

import type { NewCitiesListDto } from "@/api_services/city/city.interface";

type LocationEntry = {
  id?: number | string | null;
  title?: string;
  parent_title?: string;
};

export type LocationQuery = {
  cities?: string;
  provinces?: string;
  regions?: string;
};

type LocationEntries = {
  cities?: LocationEntry[];
  provinces?: LocationEntry[];
  regions?: LocationEntry[];
};

const LOCATION_QUERY_KEYS = ["cities", "provinces", "regions"] as const;

export const pickLocationQuery = (
  source?: Record<string, unknown> | null,
): LocationQuery =>
  LOCATION_QUERY_KEYS.reduce<LocationQuery>((result, key) => {
    const value =
      key === "provinces"
        ? (source?.provinces ?? source?.province_id)
        : source?.[key];
    const list = Array.isArray(value)
      ? value.join(",")
      : value === undefined || value === null
        ? ""
        : `${value}`;
    if (list) result[key] = list;
    return result;
  }, {});

export const hasLocationQuery = (query: LocationQuery): boolean =>
  LOCATION_QUERY_KEYS.some((key) => !!query[key]);

const cleanPath = (value: string) => {
  let decoded = value;
  try {
    decoded = decodeURI(value);
  } catch {
    // A malformed escape is compared as typed.
  }
  return decoded.replace(/\/+$/, "") || "/";
};

export const isSameLocationPath = (
  stored?: string | null,
  pathname?: string | null,
): boolean =>
  !!stored && !!pathname && cleanPath(stored) === cleanPath(pathname);

export const currentLocationQuery = (
  urlQuery: Record<string, unknown>,
  stored: { path?: string; query?: Record<string, unknown> } | undefined,
  pathname: string,
): LocationQuery => {
  const url = pickLocationQuery(urlQuery);
  if (url.cities || url.provinces) return url;
  const fallback = isSameLocationPath(stored?.path, pathname)
    ? pickLocationQuery(stored?.query)
    : {};
  // The landing path may encode the destination. Neighbourhoods are additional
  // filters owned by the URL, so removing them must never revive stored ones.
  return pickLocationQuery({
    cities: fallback.cities,
    provinces: fallback.provinces,
    regions: url.regions,
  });
};

export type LocationWords = {
  local: string;
  province: string;
  city: string;
  separator: string;
};

export const buildLocationLabel = (
  { cities = [], provinces = [], regions = [] }: LocationEntries,
  words: LocationWords,
): string => {
  if (cities.length === 1 && provinces.length === 0)
    return cities[0]?.title ?? "";
  if (provinces.length === 1 && cities.length === 0)
    return `${words.province} ${provinces[0]?.title}`;
  if (cities.length + provinces.length > 1)
    return `${cities.length + provinces.length} ${words.city}`;
  if (regions.length) return regions[0]?.parent_title ?? "";
  return "";
};

export const storedEntriesFor = (
  stored: LocationEntries | null | undefined,
  query: LocationQuery,
): LocationEntries | null => {
  const result: LocationEntries = {};
  for (const key of LOCATION_QUERY_KEYS) {
    const ids = parseIdList(query[key]);
    if (ids.length === 0) continue;
    const entries = (stored?.[key] ?? []).filter((entry) =>
      ids.includes(`${entry?.id}`),
    );
    if (entries.length !== ids.length) return null;
    result[key] = entries;
  }
  return result;
};

export const resolveLocationFromTree = (
  tree: NewCitiesListDto[] | undefined,
  query: LocationQuery,
): LocationEntries => {
  const regionIds = parseIdList(query.regions);
  const cities = query.cities
    ? resolveQueryCities(tree, query.cities)
    : regionIds.length
      ? (tree ?? [])
          .flatMap((province) => province.child ?? [])
          .filter((city) =>
            city.child?.some((region) => regionIds.includes(`${region.id}`)),
          )
      : [];

  return {
    cities,
    provinces: resolveQueryProvinces(tree, query.provinces),
    regions: cities.flatMap((city) =>
      (city.child ?? [])
        .filter((region) => regionIds.includes(`${region.id}`))
        .map((region) => ({
          id: region.id,
          title: region.title,
          parent_title: city.title,
        })),
    ),
  };
};
