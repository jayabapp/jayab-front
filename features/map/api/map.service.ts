import type { SearchedLocation } from "@/types/features/map";

const requestMap = async <T>(
  path: string,
  params: URLSearchParams,
  signal?: AbortSignal,
) => {
  const response = await fetch(`/api/map/${path}?${params}`, { signal });
  if (!response.ok) throw new Error(`Map request failed: ${response.status}`);
  return (await response.json()) as T;
};

export const MapService = {
  searchAddresses: async ({
    center,
    search,
    signal,
  }: {
    center: number[];
    search: string;
    signal?: AbortSignal;
  }): Promise<SearchedLocation[]> => {
    const params = new URLSearchParams({
      term: search,
      lat: String(center[1]),
      lng: String(center[0]),
    });
    const result = await requestMap<{ items?: SearchedLocation[] }>(
      "search",
      params,
      signal,
    );
    return result.items ?? [];
  },

  reverseGeocode: async ({
    latitude,
    longitude,
    signal,
  }: {
    latitude: number;
    longitude: number;
    signal?: AbortSignal;
  }): Promise<string> => {
    const params = new URLSearchParams({
      lat: String(latitude),
      lng: String(longitude),
    });
    const result = await requestMap<{ formatted_address?: string }>(
      "reverse",
      params,
      signal,
    );
    return result.formatted_address ?? "";
  },
};
