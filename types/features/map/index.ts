export interface SearchedLocation {
  type: string;
  title: string;
  region: string;
  address: string;
  category: string;
  location: {
    x: number;
    y: number;
    z: string;
  };
  neighbourhood: string;
}

export type MapFlightLanding = {
  animated: boolean;
  interrupted: boolean;
};

export type ApproxLocation = {
  lat: number;
  lng: number;
  radius_m: number;
};

// What a results-map marker shows. The visible text may be shortened; the title and the
// accessible name always carry the whole fact.
export type MarkerDescription = {
  label: string;
  hearts: string | null;
  title: string;
  ariaLabel: string;
  approximate: boolean;
};

export type {
  MapClusterItem,
  MapItem,
  MapPropertyItem,
} from "@/api_services/property/property.interface";
