import type { CitySuggestDto } from "@/api_services/home/home.interface";

export type { CitySuggestDto, SearchSuggDto } from "@/api_services/home/home.interface";

export type SearchHistoryEntry = {
  id: string;
  title: string;
};

export type PropertySearchInput = {
  q: string;
  /**
   * Filters chosen alongside the free text that the `/extract` call knows
   * nothing about — dates and party size from the hero search. They are merged
   * onto the derived `client_query` so one submit carries both what the text
   * resolved to and what the user picked explicitly.
   */
  extra?: Record<string, string | number | undefined>;
};

/**
 * What the home hero has staged so far. Every field is optional: the search is
 * submittable at any point, and an empty draft is simply the whole catalogue.
 */
export type HeroSearchDraft = {
  /** Free text, when the visitor typed rather than picked a place. */
  q?: string;
  /** A city id, set only when a place was actually chosen. */
  cities?: string;
  /** Shown in the field; not a filter. */
  cityTitle?: string;
  checkin?: string;
  checkout?: string;
  total_guests?: number;
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
