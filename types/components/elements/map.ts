import type { Map as NeshanSdkMap } from "@neshan-maps-platform/maplibre-sdk";

export type MapCoordinate = [number, number];

export type NeshanMapInstance = NeshanSdkMap;

export type MapStyleName = "light" | "monochrome_light";

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
