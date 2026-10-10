"use client";

import { useTranslations } from "next-intl";

import type { SearchOverlayProps } from "@/types/components/modules/search";

import SearchPanelInput from "./SearchPanelInput.client";
import SearchPanelBody from "./SearchPanelBody.client";

const SearchOverlay = ({
  term,
  boxId,
  isOpen,
  onPick,
  isStale,
  listRef,
  onClose,
  onHover,
  options,
  inputRef,
  hasOpened,
  isLoading,
  isPending,
  onKeyDown,
  onSubmit,
  activeIndex,
  onTermChange,
  panelClass,
  placeholder,
  submitButtonClass,
}: SearchOverlayProps) => {
  const t = useTranslations("common");

  const listId = `${boxId ?? "SEARCH_BOX"}-listbox`;

  return (
    <>
      <div
        className={`${panelClass} transition-all fixed flex flex-col items-center justify-start pb-4 overflow-y-auto rounded-b-10 border shadow-surface left-0 w-full -top-2 duration-500 z-50 bg-surface`}
      >
        <SearchPanelInput
          boxId={boxId}
          value={term}
          listId={listId}
          isOpen={isOpen}
          inputRef={inputRef}
          onSubmit={onSubmit}
          onKeyDown={onKeyDown}
          isPending={isPending}
          onChange={onTermChange}
          activeIndex={activeIndex}
          placeholder={placeholder}
          hasOptions={options.length > 0}
          submitButtonClass={submitButtonClass}
        />

        {hasOpened ? (
          <SearchPanelBody
            term={term}
            listId={listId}
            onPick={onPick}
            options={options}
            listRef={listRef}
            onClose={onClose}
            onHover={onHover}
            isStale={isStale}
            isLoading={isLoading}
            activeIndex={activeIndex}
            onTermChange={onTermChange}
          />
        ) : (
          <></>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        aria-label={t("close")}
        className={`fixed left-0 bg-black/35 lg:bg-transparent top-0 w-full transition-opacity ${
          isOpen ? "z-[11] h-[100dvh] opacity-100" : "opacity-0 -z-10 h-0"
        }`}
      />
    </>
  );
};

export default SearchOverlay;
