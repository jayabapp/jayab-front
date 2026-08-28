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
