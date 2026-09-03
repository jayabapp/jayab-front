"use client";

import { useSearchSuggestions } from "@features/search/hooks/useSearchSuggestions";
import { useListboxNavigation } from "@features/search/hooks/useListboxNavigation";
import { useSearchOptionPick } from "@features/search/hooks/useSearchOptionPick";
import { buildSearchOptions } from "@features/search/lib/build-search-options";
import { usePropertySearch } from "@features/search/hooks/usePropertySearch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBodyScrollLock } from "@hooks/useBodyScrollLock";

const FOCUS_DELAY_MS = 100;

/**
 * Shared behaviour for every search surface: the term, the open/closed panel, the
 * remote suggestions bound to it, the keyboard cursor over those suggestions, and
 * the submit that turns the term into a `/rooms` URL. Suggestions are only
 * requested while the panel is open, and the request is aborted when it closes.
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

  // The panel body is mounted from the first open and then kept, never before.
  // Rendering it on the server was the cause of a hydration mismatch on `/`:
  // SearchPopularPlaces reads landings through useQuery, and React Query restores
  // the dehydrated cache in an effect, so the server rendered no chips and the
  // client rendered several. It is also pure waste — the panel is off-screen on
  // first paint, so none of that markup is ever seen.
  //
  // Set during render rather than in an effect: React re-runs this component
  // immediately with the new value and commits once, so there is no extra paint
  // and no `set-state-in-effect` cascade.
  const [hasOpened, setHasOpened] = useState(false);
  if (isOpen && !hasOpened) setHasOpened(true);

  const {
    data: suggestions,
    isLoading,
    isDebouncing,
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
  const pick = useSearchOptionPick(term, close);

  // Enter on a highlighted row opens it; Enter with no highlight is left alone
  // so the form's own submit runs the free-text search.
  const onKeyDown = useCallback(
    (event: Parameters<typeof onListKeyDown>[0]) =>
      onListKeyDown(event, (index) => pick(options[index])),
    [onListKeyDown, options, pick],
  );

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
    activeIndex,
    close,
    hasOpened,
    inputRef,
    isLoading: isLoading || isDebouncing,
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
