"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useModalVisible } from "@/hooks/modal.hook";
import { useFormatNumber } from "@hooks/useFormatNumber";
import { useIsDesktop } from "@features/map/hooks/useIsDesktop";
import { parseIdList } from "@features/cities/lib/city-selection";
import { useState } from "react";
import { Icon } from "@elements/Icon";

import type { SelectiveFilterChipProps } from "@/types/components/modules/property-search-filters";
import type { IconName } from "@/types/components/elements/icon";

import PropertyModelFilter from "../PropertyModelFilter.client";
import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import Button from "@elements/Button";

const FILTER_ICONS: Record<string, IconName> = {
  property_type: "home",
  pool_type: "bath",
  pattern: "gazebo",
  entertainment: "billiard",
  welfare: "sparkles",
  cool_heat: "air-conditioner",
  kitchen: "kitchen",
  ownership: "shield",
};

const SelectiveFilterChip = ({
  list,
  title,
  queryKey,
  removeFiltersKeys,
}: SelectiveFilterChipProps) => {
  const t = useTranslations();
  const formatNumber = useFormatNumber();

  const isDesktop = useIsDesktop();
  const { _onHide, _onShow, isVisible } = useModalVisible();
  const { replace } = useRouter();
  const pathname = usePathname();
  const queriesParams = useQueryGet<Record<string, string>>();
  const [draft, setDraft] = useState<Record<string, any> | null>(null);
  const selectedCount = parseIdList(queriesParams?.[queryKey]).length;

  const startDraft = () => setDraft({ ...queriesParams });

  const submit = (close: () => void) => {
    const body = { ...(draft ?? queriesParams) };
    delete body.categories;
    delete body.page;
    close();
    replace(`${pathname}?${queryBuilder(body)}`);
  };

  const clear = (close: () => void) => {
    close();
    removeFiltersKeys([queryKey]);
  };

  const chipClass = `filter-chip ${selectedCount ? "filter-chip-active" : "filter-chip-idle"}`;
  const icon = FILTER_ICONS[queryKey];

  const label = (
    <>
      {icon ? <Icon name={icon} size={20} className="text-link" /> : null}
      <span>{title}</span>
      {selectedCount ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-action px-1.5 text-xs font-bold text-on-action">
          {formatNumber(selectedCount)}
        </span>
      ) : null}
      <Icon name="chevron-down" size={16} className="text-ink-subtle" />
    </>
  );

  const picker = (close: () => void) => (
    <>
      <PropertyModelFilter
        isMulty
        list={list}
        queryKey={queryKey}
        query={queriesParams}
        setMobileFilters={setDraft}
        mobileFilters={draft ?? queriesParams}
        containerClass="grid w-full grid-cols-2 gap-x-3"
      />
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
        <button
          type="button"
          disabled={!selectedCount}
          onClick={() => clear(close)}
          className="cursor-pointer text-sm font-semibold text-link disabled:cursor-default disabled:text-ink-subtle"
        >
          {t("listing.clearSelection")}
        </button>
        <Button
          width="w-full"
          containerClass="grow"
          onClick={() => submit(close)}
          title={t("listing.submitDo")}
        />
      </div>
    </>
  );

  if (isDesktop)
    return (
      <Popover className="relative">
        {({ close, open }) => (
          <>
            <PopoverButton
              onClick={startDraft}
              className={`${chipClass} ${open ? "!border-action" : ""}`}
            >
              {label}
            </PopoverButton>
            <PopoverPanel
              anchor={{ to: "bottom start", gap: 8 }}
              className="z-50 max-h-96 w-80 overflow-y-auto rounded-20 border border-line bg-surface p-4 shadow-elevated"
            >
              <p className="pb-1 text-base font-bold text-ink">{title}</p>
              {picker(close)}
            </PopoverPanel>
          </>
        )}
      </Popover>
    );

  return (
    <>
      <button
        type="button"
        className={chipClass}
        onClick={() => {
          startDraft();
          _onShow();
        }}
      >
        {label}
      </button>

      <ModalBottomSheet show={isVisible} onHide={_onHide}>
        <ModalHeaderPart showX title={title} onHide={_onHide} />
        <div className="flex flex-col p-4 !pb-0">{picker(_onHide)}</div>
      </ModalBottomSheet>
    </>
  );
};

export default SelectiveFilterChip;
