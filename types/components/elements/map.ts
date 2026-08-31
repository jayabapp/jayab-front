export type MapCoordinate = [number, number];

export type MapMarkerData = {
  icon?: string;
  lat: number | string;
  lng: number | string;
};

export type MapViewerProps = {
  center: number[];
  jumpToNow?: boolean;
  containerClass?: string;
  disableCenter?: boolean;
  businessMarkersData?: MapMarkerData[];
  setCenter: (center: number[]) => void;
  jumpToGivenPlace?: Partial<MapMarkerData>;
  setJumpToNow?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type InteractiveMapProps = {
  center: number[];
  containerClass?: string;
  disableCenter?: boolean;
  setCenter?: (center: number[]) => void;
  jumpToState?: { lat: string | number; lng: string | number } | null;
};
