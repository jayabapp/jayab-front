"use client";

import type { SelectiveFilterChipProps } from "@/types/components/modules/property-search-filters";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { parseIdList } from "@features/cities/lib/city-selection";
import { usePathname, useRouter } from "next/navigation";
import { useModalVisible } from "@/hooks/modal.hook";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import PropertyModelFilter from "../PropertyModelFilter.client";
import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

/** One dynamic attribute filter: a chip that opens its own bottom-sheet picker. */
const SelectiveFilterChip = ({
  list,
  queryKey,
  removeFiltersKeys,
  title,
}: SelectiveFilterChipProps) => {
  const { _onHide, _onShow, isVisible } = useModalVisible();
  const { replace } = useRouter();
  const pathname = usePathname();
  const queriesParams = useQueryGet<Record<string, string>>();
  const [draft, setDraft] = useState<Record<string, any> | null>(null);
  const selectedCount = parseIdList(queriesParams?.[queryKey]).length;

  const openSheet = () => {
    // The sheet edits a copy of the current URL filters and only commits on submit.
    setDraft({ ...queriesParams });
    _onShow();
  };

  const submit = () => {
    const body = { ...(draft ?? queriesParams) };
    delete body.categories;
    delete body.page;
    _onHide();
    replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={openSheet}
        className={`filter-chip ${selectedCount ? "filter-chip-active" : "filter-chip-idle"}`}
      >
        <span className="text-xs pr-2">{title}</span>
        {selectedCount ? (
          <>
            <span className="text-sm font-medium pr-2">
              {selectedCount} <span className="text-xxs font-normal">{_STRINGS.ITEM}</span>
            </span>
            <span
              role="button"
              tabIndex={0}
              aria-label={`${_STRINGS.REMOVE_FILTERS} ${title}`}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                removeFiltersKeys([queryKey]);
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                removeFiltersKeys([queryKey]);
              }}
              className="mr-2 flex aspect-square h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-brand-600"
            >
              <ContentImage
                alt=""
                width={8}
                height={8}
                className="w-2 h-2 rotate-45 aspect-square"
                src="/assets/icons/adds/blue_plus.svg"
              />
            </span>
          </>
        ) : null}
      </button>

      <ModalBottomSheet show={isVisible} onHide={_onHide}>
        <ModalHeaderPart showX title={title} onHide={_onHide} />
        <div className="flex flex-col p-4 !pb-0">
          <PropertyModelFilter
            isMulty
            list={list}
            queryKey={queryKey}
            query={queriesParams}
            mobileFilters={draft ?? queriesParams}
            setMobileFilters={setDraft}
          />
          <Button
            width=" w-full "
            onClick={submit}
            containerClass=" w-full "
            title={_STRINGS.SUBMIT_DO}
          />
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default SelectiveFilterChip;
