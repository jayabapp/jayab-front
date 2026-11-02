export type StaticIconSet =
  | "amenities"
  | "card-icons"
  | "heating-cooling"
  | "kitchen-amenities"
  | "pool-type"
  | "property-overview";

export type StaticIconRef = {
  n: string;
  set: StaticIconSet;
};

export type StaticIconProps = {
  className?: string;
  icon: StaticIconRef;
  size?: 16 | 20 | 24 | 32 | 56 | 64;
};
