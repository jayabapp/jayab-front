export type { CitySuggestDto, SearchSuggDto } from "@/api_services/home/home.interface";

import type { CitySuggestDto } from "@/api_services/home/home.interface";
import type { SearchOption } from "@/types/features/search";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export type SearchBoxAppearance = {
  bg?: string;
  disable_cancel?: boolean;
};

export type SearchInputProps = {
  autofocus?: boolean;
  boxId?: string;
  cancelText?: string;
  children?: ReactNode;
  containerClass?: string;
  disableTypeing?: boolean;
  initValue?: string;
  item?: SearchBoxAppearance;
  onClear: () => void | null;
  onSubmit: (value: string | null) => void | null;
  passedQuerykey?: string;
  passedText?: string;
  placeholder?: string;
};

export type SearchPanelInputProps = {
  activeIndex: number;
  boxId?: string;
  hasOptions: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  isPending: boolean;
  listId: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onSubmit: () => void;
  placeholder?: string;
  submitButtonClass?: string;
  value: string;
};

export type SearchOverlayProps = {
  activeIndex: number;
  boxId?: string;
  hasOpened: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isLoading: boolean;
  isOpen: boolean;
  isPending: boolean;
  listRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onHover: (index: number) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onPick: (option: SearchOption) => void;
  onSubmit: () => void;
  onTermChange: (value: string) => void;
  options: SearchOption[];
  panelClass: string;
  placeholder?: string;
  submitButtonClass?: string;
  term: string;
};

export type SearchPanelBodyProps = {
  activeIndex: number;
  isLoading: boolean;
  listId: string;
  listRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onHover: (index: number) => void;
  onPick: (option: SearchOption) => void;
  onTermChange: (value: string) => void;
  options: SearchOption[];
  term: string;
};

export type PopSearchBoxProps = {
  boxId?: string;
  containerClass?: string;
  initValue?: string;
  item?: SearchBoxAppearance;
  justIcon?: boolean;
  onClear?: () => void | null;
  onSubmit?: (value: string | null) => void | null;
  placeholder?: string;
};

export type HomePopSearchProps = PopSearchBoxProps & {
  setShowPop: Dispatch<SetStateAction<boolean>>;
  showPop: boolean;
};

export type SearchBoxDropDownProps = {
  boxId?: string;
  containerClass?: string;
  initValue?: string;
  item?: SearchBoxAppearance;
  placeholder?: string;
};

export type SearchSuggestionsProps = {
  activeIndex: number;
  isLoading: boolean;
  listId: string;
  listRef: React.RefObject<HTMLDivElement | null>;
  onHover: (index: number) => void;
  onPick: (option: SearchOption) => void;
  options: SearchOption[];
  searchedText: string;
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
  onRemove: () => void;
  title?: string;
  isProvince?: boolean;
};

export type SearchQueryParamSyncProps = {
  onSearchParam: (param: string | null) => void;
  queryKey?: string;
};

export type HeroDestinationSearchProps = {
  boxId?: string;
  /** The small persistent caption above the value. */
  label: string;
  /** What the closed field shows: a chosen place's title, or the typed text. */
  value?: string;
  onTermChange?: (term: string) => void;
  onPickPlace?: (option: SearchOption) => void;
};
