export interface State {
  id: number;
  title: string;
  image?: null;
  child?: City[];
}

export interface City {
  id: number;
  title: string;
}

export interface NewCitiesListDto {
  id: number;
  title: string;
  slug: string;
  image: null;
  child: ChildCities[];
}

export interface ChildCities {
  id: number;
  title: string;
  child?: ChildCities[];
}
