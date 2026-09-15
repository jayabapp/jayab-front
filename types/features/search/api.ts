import type { CitySuggestDto } from "@/api_services/home/home.interface";

export type {
  CitySuggestDto,
  SearchSuggDto,
} from "@/api_services/home/home.interface";

export type SearchHistoryEntry = {
  id: string;
  title: string;
};

export type PropertySearchInput = {
  q: string;
  extra?: Record<string, string | number | undefined>;
};

export type HeroSearchDraft = {
  q?: string;
  cities?: string;
  provinces?: string;
  regions?: string;
  checkin?: string;
  checkout?: string;
  cityTitle?: string;
  landingUrl?: string;
  /** A picked listing: submitting opens it with the staged stay instead of searching. */
  propertyHref?: string;
  total_guests?: number;
};

export type SearchOptionKind = "place" | "property" | "guide";

export type SearchOptionLocations = {
  regions?: CitySuggestDto[];
  cities?: { id?: number | null; title?: string }[];
  provinces?: { id?: number | null; title?: string }[];
};

export type SearchOption = {
  id: string;
  href: string;
  label: string;
  hint?: string;
  /** Overrides the kind's badge word, so a place can say province/city/region. */
  badge?: string;
  kind: SearchOptionKind;
  /** A listing's public code. */
  code?: string;
  city?: CitySuggestDto;
  locations?: SearchOptionLocations;
};

export type SearchOptionRowProps = {
  index: number;
  isActive: boolean;
  option: SearchOption;
  onSelect: () => void;
  onHover: (index: number) => void;
};
