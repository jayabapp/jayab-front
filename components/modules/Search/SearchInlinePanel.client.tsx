"use client";

import type { SearchInlinePanelProps } from "@/types/components/modules/search";
import { useSearchPanel } from "@features/search/hooks/useSearchPanel";
import { useCitiesStore } from "@/store";
import { useCallback } from "react";

import SearchPanelInput from "./parts/SearchPanelInput.client";
import SearchPanelBody from "./parts/SearchPanelBody.client";
import _STRINGS from "@/utils/LocalStrings";

/**
 * The same combobox the pop-over surfaces use, laid out in the normal flow
 * instead of in a fixed overlay.
 *
 * The hero's mobile sheet already *is* the overlay: it owns the viewport, the
 * backdrop and the scroll lock. Reusing `SearchOverlay` there would have nested
 * a second `fixed inset-0` layer with its own dismiss button inside the first,
 * so the panel's two halves — the input and the result body — are composed
 * directly here instead. Both halves stay private to this module; this file is
 * the public seam.
 */
const SearchInlinePanel = ({
  boxId = "HERO_SHEET_SEARCH",
  isActive,
  onPickPlace,
  onSubmitTerm,
  onTermChange,
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
    activeIndex,
    close,
    inputRef,
    isLoading,
    isPending,
    isStale,
    listRef,
    onKeyDown,
    options,
    pick,
    setActiveIndex,
    setTerm,
    submit,
    term,
  } = useSearchPanel({
    // `isOpen` here means "this step is the one on screen". It gates the
    // suggestion request and the autofocus, so a collapsed step neither holds a
    // request open nor steals the keyboard from the step that is showing.
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
