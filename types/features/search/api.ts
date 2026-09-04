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
  checkin?: string;
  checkout?: string;
  cityTitle?: string;
  landingUrl?: string;
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
  kind: SearchOptionKind;
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
