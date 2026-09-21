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
