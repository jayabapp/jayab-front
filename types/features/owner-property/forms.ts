import type { PropInitDto } from "@/api_services/property/property.interface";

export type PropertyDraftStep =
  | "assistants"
  | "bedroom"
  | "environment"
  | "facility"
  | "initials"
  | "location"
  | "media"
  | "price"
  | "terms";

export type PropertyInitialsValues = {
  can_chat: boolean | null;
  city: string | number | null;
  floor: string | number | null;
  title: string | number | null;
  region: string | number | null;
  location_access: boolean | null;
  address: string | number | null;
  province: string | number | null;
  direction: string | number | null;
  land_area: string | number | null;
  floor_count: string | number | null;
  building_area: string | number | null;
  property_type: string | number | null;
  owenershp_type: string | number | null;
  units_in_floor: string | number | null;
  construction_year: string | number | null;
};

export type PropertyEnvironmentValues = {
  access: string | number | null;
  pattern: string | number | null;
  neighborhood: string | number | null;
  pattern_dscr: string | number | null;
  distance_dscr: string | number | null;
};

export type PropertyMediaValues = {
  featureImageId: string | number;
  images: any[];
};

export type PropertyDraftFormOptions<TValues> = {
  map: (draft: PropInitDto) => TValues;
  canSeed?: (draft: PropInitDto) => boolean;
};
