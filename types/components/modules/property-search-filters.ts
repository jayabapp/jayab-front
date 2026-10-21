import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { IconName } from "@/types/components/elements/icon";
export type { ProvienceTypesDto } from "@/api_services/property/property.interface";
import type { ProvienceTypesDto } from "@/api_services/property/property.interface";
import type { ChildCities } from "@/api_services/city/city.interface";

export type SelectedFiltersBarProps = {
  containerClass?: string;
  hiddenFilters?: string[];
  query: Record<string, string>;
  cityWithRegions: ChildCities | null;
  setShowRegions: Dispatch<SetStateAction<boolean>>;
  propertyTypes: Record<string, ProvienceTypesDto[]>;
  setFilterModalShow: Dispatch<SetStateAction<boolean>>;
};

export type OrderedFilterChip = {
  id: string;
  queryKeys: readonly string[];
  active: boolean;
  node: ReactNode;
};

export type SpecialFilterButtonsProps = {
  containerClass?: string;
  hiddenFilters?: string[];
  query: Record<string, string>;
};

export type SpecialFilterButtonProps = {
  isChecked: boolean;
  cb: () => void | null;
  item: { img: string; title: string };
};

export type SelectiveFilterChipProps = {
  title: string;
  queryKey: string;
  list: ProvienceTypesDto[];
  removeFiltersKeys: (keys: string[]) => void;
};

export type PropertyModelFilterProps = {
  query?: any;
  isMulty?: boolean;
  mobileFilters?: any;
  list: any[] | undefined;
  queryKey: number | string;
  onClickCb?: () => void | null;
  containerClass?: string;
  setMobileFilters?: Dispatch<any>;
};

export type TripSegmentProps = {
  icon: IconName;
  title: string;
  /** Selected value; the segment shows the title and a chevron while it is null. */
  value: string | null;
  onOpen: () => void;
  onClear: () => void;
};

export type TripFilterPillProps = {
  dateLabel: string | null;
  guestLabel: string | null;
  onDateClick: () => void;
  onGuestClick: () => void;
  onClearDate: () => void;
  onClearGuests: () => void;
};

export type RemovableFilterChipProps = {
  label: string;
  onRemove: () => void;
  /** Opens the relevant editor for this filter. Omitted for chips that have
   * no dedicated editor to reopen (e.g. price range, commission). */
  onLabelClick?: () => void;
};

export type PoolFilterChipProps = {
  label: string;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
};

export type PropertyFilterDraft = Record<string, any>;

export type FilterSectionProps = {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
};

export type FilterPanelHeaderProps = {
  activeCount: number;
  onReset: () => void;
};

export type FilterApplyBarProps = {
  enabled?: boolean;
  onApply: () => void;
  draft: PropertyFilterDraft;
};

export type PropertyFilterFormProps = {
  onReset?: () => void;
  baselineFilters?: PropertyFilterDraft;
  hiddenFilters?: string[];
  filters: PropertyFilterDraft;
  queries: Record<string, string>;
  setFilters: Dispatch<PropertyFilterDraft>;
  propertyTypes?: Record<string, ProvienceTypesDto[]>;
};

export type PropertySortMenuProps = {
  query?: Record<string, string>;
};

export type DateFilterProps = {
  filters: PropertyFilterDraft;
  setFilters: Dispatch<any>;
};

export type FilterCheckProps = {
  title: string;
  queryKey: string;
  withBadge?: boolean;
  query?: PropertyFilterDraft;
  mobileFilters?: PropertyFilterDraft;
  setMobileFilters?: Dispatch<PropertyFilterDraft>;
};

export type FilterCounterProps = {
  title: string;
  queryKey: string;
  mobileFilters?: PropertyFilterDraft;
  setMobileFilters?: Dispatch<PropertyFilterDraft>;
  query?: Record<string, string | string[] | undefined>;
};

export type PriceRangeFilterProps = {
  steps?: number;
  lowerKey: string;
  upLimit?: number;
  higherKey: string;
  lowLimit?: number;
  setFilters?: Dispatch<any>;
  filters?: PropertyFilterDraft;
};

export type PropertyRulesFilterProps = {
  countFilters?: PropertyFilterDraft;
  hiddenFilters?: string[];
  filters: PropertyFilterDraft;
  queries: Record<string, string>;
  setFilters: Dispatch<PropertyFilterDraft>;
  propertyTypes?: Record<
    string,
    { id: string | number; title: string; canonical_title?: string }[]
  >;
};
