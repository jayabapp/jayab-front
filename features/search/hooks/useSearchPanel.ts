"use client";

import { useSearchSuggestions } from "@features/search/hooks/useSearchSuggestions";
import { usePropertySearch } from "@features/search/hooks/usePropertySearch";
import { useBodyScrollLock } from "@hooks/useBodyScrollLock";
import { useCallback, useEffect, useRef, useState } from "react";

const FOCUS_DELAY_MS = 100;

/**
 * Shared behaviour for every search surface: the term, the open/closed panel, the
 * remote suggestions bound to it, and the submit that turns the term into a
 * `/rooms` URL. Suggestions are only requested while the panel is open, and the
 * request is aborted when it closes.
 */
export const useSearchPanel = ({
  initValue,
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  initValue?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (value: string | null) => void | null;
}) => {
  const [term, setTerm] = useState(initValue ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: suggestions,
    isLoading,
    isDebouncing,
  } = useSearchSuggestions(term, isOpen);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const { mutate, isPending } = usePropertySearch(close);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS);
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
    close,
    inputRef,
    isLoading: isLoading || isDebouncing,
    isPending,
    onSearchParam,
    open: useCallback(() => onOpenChange(true), [onOpenChange]),
    setTerm,
    submit: useCallback(() => mutate({ q: term }), [mutate, term]),
    suggestions,
    term,
  };
};
