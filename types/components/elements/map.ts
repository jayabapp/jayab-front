import type { Map as NeshanSdkMap } from "@neshan-maps-platform/maplibre-sdk";

export type MapCoordinate = [number, number];

export type NeshanMapInstance = NeshanSdkMap;

// Day styles. Each has a night twin that NeshanMap swaps in with the site theme.
export type MapStyleName = "light" | "monochrome_light";

// West, south, east, north.
export type MapBounds = [number, number, number, number];

export type MapMarkerData = {
  lat: number | string;
  lng: number | string;
};

export type NeshanMapProps = {
  zoom: number;
  className?: string;
  ariaLabel?: string;
  onError?: () => void;
  center: MapCoordinate;
  // Opens framed on this box instead of `center` and `zoom`.
  bounds?: MapBounds | null;
  mapStyle?: MapStyleName;
  showGeolocate?: boolean;
  showNavigation?: boolean;
  cooperativeGestures?: boolean;
  onMapReady?: (map: NeshanMapInstance) => void;
};

export type MapViewerProps = {
  center: number[];
  onError?: () => void;
  containerClass?: string;
  businessMarkersData?: MapMarkerData[];
  jumpToGivenPlace?: Partial<MapMarkerData>;
};

export type InteractiveMapProps = {
  center: number[];
  onError?: () => void;
  containerClass?: string;
  disableCenter?: boolean;
  setCenter?: (center: number[]) => void;
  jumpToState?: { lat: string | number; lng: string | number } | null;
};

export type MapPinOptions = {
  animate?: boolean;
};

export type MapFallbackCardProps = {
  href?: string;
  title?: string;
  message?: string;
  className?: string;
  actionLabel?: string;
};

export type MapMarkerState = "idle" | "hover" | "selected";

export type PricePinOptions = {
  key: string;
  label: string;
  title: string;
  ariaLabel: string;
  approximate: boolean;
};

export type ClusterMarkerOptions = {
  key: string;
  count: number;
  label: string;
  ariaLabel: string;
};
