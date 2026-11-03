import type { Dispatch, ReactNode, SetStateAction } from "react";
export type { CitySuggestDto } from "@/api_services/home/home.interface";
import type { CitySuggestDto } from "@/api_services/home/home.interface";
export type { SearchSuggDto } from "@/api_services/home/home.interface";
import type { SearchOption } from "@/types/features/search";
import type { CityListPick } from "@/types/features/search";

export type SearchBoxAppearance = {
  bg?: string;
  disable_cancel?: boolean;
};

export type SearchInputProps = {
  boxId?: string;
  initValue?: string;
  cancelText?: string;
  autofocus?: boolean;
  passedText?: string;
  placeholder?: string;
  children?: ReactNode;
  passedQuerykey?: string;
  containerClass?: string;
  disableTypeing?: boolean;
  item?: SearchBoxAppearance;
  onClear: () => void | null;
  onSubmit: (value: string | null) => void | null;
};

export type SearchPanelInputProps = {
  value: string;
  boxId?: string;
  listId: string;
  isOpen: boolean;
  isPending: boolean;
  activeIndex: number;
  hasOptions: boolean;
  onSubmit: () => void;
  placeholder?: string;
  submitButtonClass?: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

export type SearchOverlayProps = {
  term: string;
  boxId?: string;
  isOpen: boolean;
  isStale?: boolean;
  hasOpened: boolean;
  isLoading: boolean;
  isPending: boolean;
  panelClass: string;
  activeIndex: number;
  onClose: () => void;
  onSubmit: () => void;
  placeholder?: string;
  options: SearchOption[];
  submitButtonClass?: string;
  onHover: (index: number) => void;
  onTermChange: (value: string) => void;
  onPick: (option: SearchOption) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  onKeyDown: (event: React.KeyboardEvent) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

export type SearchPanelBodyProps = {
  term: string;
  listId: string;
  isStale?: boolean;
  isLoading: boolean;
  activeIndex: number;
  onClose: () => void;
  hideCityList?: boolean;
  options: SearchOption[];
  onHover: (index: number) => void;
  onTermChange: (value: string) => void;
  onPick: (option: SearchOption) => void;
  onPickCities?: (pick: CityListPick) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
};

export type PopSearchBoxProps = {
  boxId?: string;
  justIcon?: boolean;
  initValue?: string;
  placeholder?: string;
  containerClass?: string;
  item?: SearchBoxAppearance;
  onClear?: () => void | null;
  onSubmit?: (value: string | null) => void | null;
};

export type HomePopSearchProps = PopSearchBoxProps & {
  showPop: boolean;
  setShowPop: Dispatch<SetStateAction<boolean>>;
};

export type SearchBoxDropDownProps = {
  boxId?: string;
  initValue?: string;
  placeholder?: string;
  containerClass?: string;
  item?: SearchBoxAppearance;
};

export type SearchSuggestionsProps = {
  listId: string;
  isStale?: boolean;
  isLoading: boolean;
  activeIndex: number;
  searchedText: string;
  options: SearchOption[];
  onHover: (index: number) => void;
  onPick: (option: SearchOption) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
};

export type SearchSuggestionCityProps = {
  city: CitySuggestDto;
};

export type SearchHistoryChipsProps = {
  onSelect: (title: string) => void;
};

export type SearchPopularPlacesProps = {
  onClose: () => void;
};

export type SearchSelectedLocationsProps = {
  onClose: () => void;
};

export type SearchLocationChipProps = {
  title?: string;
  onRemove: () => void;
  isProvince?: boolean;
};

export type SearchQueryParamSyncProps = {
  onSearchParam: (param: string | null) => void;
  queryKey?: string;
};

export type SearchInlinePanelProps = {
  boxId?: string;
  isActive: boolean;
  placeholder?: string;
  onTermChange?: (term: string) => void;
  onSubmitTerm?: (term: string) => void;
  onPickCities?: (pick: CityListPick) => void;
  onPickPlace?: (option: SearchOption) => void;
};

export type HeroDestinationSearchProps = {
  label: string;
  boxId?: string;
  value?: string;
  onTermChange?: (term: string) => void;
  onPickPlace?: (option: SearchOption) => void;
};
