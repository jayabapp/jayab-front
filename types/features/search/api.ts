import type { CitySuggestDto } from "@/api_services/home/home.interface";

export type { CitySuggestDto, SearchSuggDto } from "@/api_services/home/home.interface";

export type SearchHistoryEntry = {
  id: string;
  title: string;
};

export type PropertySearchInput = {
  q: string;
};

/** What a suggestion row stands for; drives its icon, badge and click behaviour. */
export type SearchOptionKind = "place" | "property" | "guide";

export type SearchOptionLocations = {
  cities?: { id?: number | null; title?: string }[];
  provinces?: { id?: number | null; title?: string }[];
  regions?: CitySuggestDto[];
};

export type SearchOption = {
  /** Stable across renders so React keys survive a refetch of the same term. */
  id: string;
  kind: SearchOptionKind;
  label: string;
  /** Secondary line — the parent city or province for a place. */
  hint?: string;
  href: string;
  city?: CitySuggestDto;
  locations?: SearchOptionLocations;
};

export type SearchOptionRowProps = {
  index: number;
  isActive: boolean;
  onHover: (index: number) => void;
  onSelect: () => void;
  option: SearchOption;
};
