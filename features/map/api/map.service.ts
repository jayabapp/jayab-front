import type { SearchedLocation } from "@/types/features/map";

const NESHAN_API_KEY = "service.2d7bb2fede1d4108ac849863562173de";

const requestNeshan = async <T>(url: string, signal?: AbortSignal) => {
  const response = await fetch(url, {
    headers: { "Api-Key": NESHAN_API_KEY },
    signal,
  });
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
    const result = await requestNeshan<{ items?: SearchedLocation[] }>(
      `https://api.neshan.org/v1/search?${params}`,
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
    const result = await requestNeshan<{ formatted_address?: string }>(
      `https://api.neshan.org/v5/reverse?${params}`,
      signal,
    );
    return result.formatted_address ?? "";
  },
};
