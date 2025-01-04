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
