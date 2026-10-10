"use client";

import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useModalVisible } from "@/hooks/modal.hook";
import { ContentImage } from "@elements/Image";
import { parseIdList } from "@features/cities/lib/city-selection";
import { useState } from "react";

import type { SelectiveFilterChipProps } from "@/types/components/modules/property-search-filters";

import PropertyModelFilter from "../PropertyModelFilter.client";
import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import Button from "@elements/Button";

const SelectiveFilterChip = ({
  list,
  title,
  queryKey,
  removeFiltersKeys,
}: SelectiveFilterChipProps) => {
  const t = useTranslations();

  const { _onHide, _onShow, isVisible } = useModalVisible();
  const { replace } = useRouter();
  const pathname = usePathname();
  const queriesParams = useQueryGet<Record<string, string>>();
  const [draft, setDraft] = useState<Record<string, any> | null>(null);
  const selectedCount = parseIdList(queriesParams?.[queryKey]).length;

  const openSheet = () => {
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
        <span className="text-xs ps-2">{title}</span>
        {selectedCount ? (
          <>
            <span className="text-sm font-medium ps-2">
              {selectedCount}{" "}
              <span className="text-2xs font-normal">{t("listing.item")}</span>
            </span>
            <span
              role="button"
              tabIndex={0}
              aria-label={`${t("common.removeFilters")} ${title}`}
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
              className="ms-2 flex aspect-square h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-action"
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
            setMobileFilters={setDraft}
            mobileFilters={draft ?? queriesParams}
          />
          <Button
            width=" w-full "
            onClick={submit}
            containerClass=" w-full "
            title={t("listing.submitDo")}
          />
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default SelectiveFilterChip;
