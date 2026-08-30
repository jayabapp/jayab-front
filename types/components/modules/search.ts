export type { CitySuggestDto, SearchSuggDto } from "@/api_services/home/home.interface";

import type { CitySuggestDto, SearchSuggDto } from "@/api_services/home/home.interface";
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
  boxId?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isPending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  submitButtonClass?: string;
  value: string;
};

export type SearchOverlayProps = {
  boxId?: string;
  isLoading: boolean;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onTermChange: (value: string) => void;
  panelClass: string;
  placeholder?: string;
  submitButtonClass?: string;
  suggestions?: SearchSuggDto | null;
  term: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

export type SearchPanelBodyProps = {
  isLoading: boolean;
  onClose: () => void;
  onTermChange: (value: string) => void;
  suggestions?: SearchSuggDto | null;
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
  isLoading: boolean;
  onClose: () => void;
  searchedText: string;
  data?: SearchSuggDto | null;
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
