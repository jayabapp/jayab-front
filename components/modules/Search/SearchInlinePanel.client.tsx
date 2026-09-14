"use client";

import type { SearchInlinePanelProps } from "@/types/components/modules/search";
import { useSearchPanel } from "@features/search/hooks/useSearchPanel";
import { useCitiesStore } from "@/store";
import { useCallback } from "react";

import SearchPanelInput from "./parts/SearchPanelInput.client";
import SearchPanelBody from "./parts/SearchPanelBody.client";
import _STRINGS from "@/utils/LocalStrings";

const SearchInlinePanel = ({
  isActive,
  onPickPlace,
  onSubmitTerm,
  onTermChange,
  boxId = "HERO_SHEET_SEARCH",
  placeholder = _STRINGS.HERO_WHERE_PLACEHOLDER,
}: SearchInlinePanelProps) => {
  const onPickOption = useCallback(
    (option?: Parameters<NonNullable<typeof onPickPlace>>[0]) => {
      if (!option) return;
      if (option.kind === "place")
        useCitiesStore.setState({ locationsData: option.locations ?? {} });
      onPickPlace?.(option);
    },
    [onPickPlace],
  );

  const {
    pick,
    term,
    close,
    submit,
    isStale,
    listRef,
    options,
    setTerm,
    inputRef,
    isLoading,
    isPending,
    onKeyDown,
    activeIndex,
    setActiveIndex,
  } = useSearchPanel({
    isOpen: isActive,
    onOpenChange: () => undefined,
    onPickOption,
  });

  const onChangeTerm = useCallback(
    (next: string) => {
      setTerm(next);
      onTermChange?.(next);
    },
    [onTermChange, setTerm],
  );

  const onSubmit = useCallback(
    () => (onSubmitTerm ? onSubmitTerm(term) : submit()),
    [onSubmitTerm, submit, term],
  );

  const listId = `${boxId}-listbox`;

  return (
    <div className="flex w-full flex-col">
      <SearchPanelInput
        isOpen
        value={term}
        boxId={boxId}
        listId={listId}
        inputRef={inputRef}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        isPending={isPending}
        onChange={onChangeTerm}
        activeIndex={activeIndex}
        placeholder={placeholder}
        hasOptions={options.length > 0}
      />

      <SearchPanelBody
        term={term}
        listId={listId}
        hideCityList
        onPick={pick}
        onClose={close}
        options={options}
        listRef={listRef}
        isStale={isStale}
        isLoading={isLoading}
        onTermChange={onChangeTerm}
        onHover={setActiveIndex}
        activeIndex={activeIndex}
      />
    </div>
  );
};

export default SearchInlinePanel;
