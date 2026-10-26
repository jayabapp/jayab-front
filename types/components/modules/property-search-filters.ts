import type { Dispatch, ReactNode, SetStateAction } from "react";
export type { ProvienceTypesDto } from "@/api_services/property/property.interface";
import type { ProvienceTypesDto } from "@/api_services/property/property.interface";
import type { ChildCities } from "@/api_services/city/city.interface";
import type { IconName } from "@/types/components/elements/icon";

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
  active: boolean;
  node: ReactNode;
  queryKeys: readonly string[];
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
};

export type FilterEditorChipProps = {
  title: string;
  icon?: IconName;
  showCount?: boolean;
  panelClass?: string;
  label?: string | null;
  keys: readonly string[];
  renderEditor: (
    draft: PropertyFilterDraft,
    setDraft: Dispatch<SetStateAction<PropertyFilterDraft>>,
  ) => ReactNode;
};

export type FilterEditorBodyProps = Pick<
  FilterEditorChipProps,
  "keys" | "renderEditor"
> & {
  onDone: () => void;
  isValid?: (draft: PropertyFilterDraft) => boolean;
};

export type RulesFilterChipProps = {
  propertyTypes?: Record<
    string,
    { id: string | number; title: string; canonical_title?: string }[]
  >;
};

export type RangeFilterChipProps = {
  unit: string;
  title: string;
  steps: number;
  upLimit: number;
  icon?: IconName;
  lowerKey: string;
  higherKey: string;
  labelTitle?: string;
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
  title: string;
  icon: IconName;
  onOpen: () => void;
  onClear: () => void;
  value: string | null;
};

export type TripFilterPillProps = {
  onDateClick: () => void;
  onClearDate: () => void;
  onGuestClick: () => void;
  dateLabel: string | null;
  guestLabel: string | null;
  onClearGuests: () => void;
};

export type RemovableFilterChipProps = {
  label: string;
  onRemove: () => void;
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
  children: ReactNode;
  defaultOpen?: boolean;
};

export type FilterPanelHeaderProps = {
  resetLabel?: string;
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
  hiddenFilters?: string[];
  filters: PropertyFilterDraft;
  queries: Record<string, string>;
  baselineFilters?: PropertyFilterDraft;
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
