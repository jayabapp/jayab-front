"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchSuggestions } from "@features/search/hooks/useSearchSuggestions";
import { useListboxNavigation } from "@features/search/hooks/useListboxNavigation";
import { useSearchOptionPick } from "@features/search/hooks/useSearchOptionPick";
import { buildSearchOptions } from "@features/search/lib/build-search-options";
import { usePropertySearch } from "@features/search/hooks/usePropertySearch";
import { useBodyScrollLock } from "@hooks/useBodyScrollLock";

import type { SearchOption } from "@/types/features/search";

const FOCUS_DELAY_MS = 100;

export type TUseSearchPanel = {
  isOpen: boolean;
  initValue?: string;
  lockScroll?: boolean;
  onOpenChange: (open: boolean) => void;
  onPickOption?: (option?: SearchOption) => void;
  onSubmit?: (value: string | null) => void | null;
};

export const useSearchPanel = ({
  isOpen,
  onSubmit,
  initValue,
  onOpenChange,
  onPickOption,
  lockScroll = true,
}: TUseSearchPanel) => {
  const [term, setTerm] = useState(initValue ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasOpened, setHasOpened] = useState(false);
  if (isOpen && !hasOpened) setHasOpened(true);

  const {
    isStale,
    isLoading,
    data: suggestions,
  } = useSearchSuggestions(term, isOpen);

  const options = useMemo(() => buildSearchOptions(suggestions), [suggestions]);
  const {
    activeIndex,
    listRef,
    onKeyDown: onListKeyDown,
    setActiveIndex,
  } = useListboxNavigation(options.length, term);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const { mutate, isPending } = usePropertySearch(close);
  const navigateToOption = useSearchOptionPick(term, close);
  const pickOption = onPickOption ?? navigateToOption;
  const pick = useCallback(
    (option?: SearchOption) => {
      if (onPickOption && option?.label) setTerm(option.label);
      pickOption(option);
    },
    [onPickOption, pickOption],
  );

  const onKeyDown = useCallback(
    (event: Parameters<typeof onListKeyDown>[0]) =>
      onListKeyDown(event, (index) => pick(options[index])),
    [onListKeyDown, options, pick],
  );

  useBodyScrollLock(isOpen && lockScroll);

  useEffect(() => {
    if (!isOpen) return;
    const timeout = window.setTimeout(
      () => inputRef.current?.focus(),
      FOCUS_DELAY_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  const onSearchParam = useCallback(
    (param: string | null) => {
      if (!param) return;
      setTerm(param);
      onSubmit?.(param);
      onOpenChange(false);
    },
    [onOpenChange, onSubmit],
  );

  return {
    activeIndex,
    close,
    hasOpened,
    inputRef,
    isLoading,
    isStale,
    isPending,
    listRef,
    onKeyDown,
    onSearchParam,
    pick,
    open: useCallback(() => onOpenChange(true), [onOpenChange]),
    options,
    setActiveIndex,
    setTerm,
    submit: useCallback(() => mutate({ q: term }), [mutate, term]),
    suggestions,
    term,
  };
};
