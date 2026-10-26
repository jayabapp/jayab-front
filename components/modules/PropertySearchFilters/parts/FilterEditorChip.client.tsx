"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { useDiscoveryQueryReplace } from "@features/properties/hooks/useDiscoveryQueryReplace";
import { extraDiscoveryFilters } from "@features/properties/lib/discovery-filter-policy";
import { useDiscoveryBaseline } from "@features/properties/context/DiscoveryContext";
import { countFilterValues } from "@features/properties/lib/count-active-filters";
import { useDiscoveryQuery } from "@features/properties/context/DiscoveryContext";
import { countFilterGroup } from "@features/properties/lib/count-active-filters";
import { useTranslations } from "next-intl";
import { useFormatNumber } from "@hooks/useFormatNumber";
import { useIsDesktop } from "@features/map/hooks/useIsDesktop";
import { useState } from "react";
import { Icon } from "@elements/Icon";

import type { FilterEditorBodyProps } from "@/types/components/modules/property-search-filters";
import type { FilterEditorChipProps } from "@/types/components/modules/property-search-filters";
import type { PropertyFilterDraft } from "@/types/components/modules/property-search-filters";

import Button from "@elements/Button";

export const FilterEditorBody = ({
  keys,
  onDone,
  isValid,
  renderEditor,
}: FilterEditorBodyProps) => {
  const t = useTranslations();
  const query = useDiscoveryQuery();
  const replaceQuery = useDiscoveryQueryReplace();

  const [draft, setDraft] = useState<PropertyFilterDraft>(() =>
    Object.fromEntries(
      keys
        .filter((key) => query[key] !== undefined)
        .map((key) => [key, query[key]]),
    ),
  );

  const commit = (values: PropertyFilterDraft) => {
    const body: Record<string, unknown> = { ...query };
    for (const key of keys) {
      if (countFilterValues(values, key) > 0) body[key] = values[key];
      else delete body[key];
    }
    replaceQuery(body);
    onDone();
  };

  const hasSelection = countFilterGroup(draft, keys) > 0;

  return (
    <>
      {renderEditor(draft, setDraft)}
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
        <button
          type="button"
          disabled={!hasSelection}
          onClick={() => commit({})}
          className="cursor-pointer text-sm font-semibold text-link disabled:cursor-default disabled:text-ink-subtle"
        >
          {t("listing.clearSelection")}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDone}
            className="h-11 cursor-pointer rounded-10 px-4 text-sm font-semibold text-ink hover:bg-surface-muted"
          >
            {t("common.cancel")}
          </button>
          <Button
            title={t("listing.submitDo")}
            disabled={isValid ? !isValid(draft) : false}
            onClick={() => commit(draft)}
          />
        </div>
      </div>
    </>
  );
};

const FilterEditorChip = ({
  keys,
  icon,
  title,
  label,
  renderEditor,
  showCount = false,
  panelClass = "w-80",
}: FilterEditorChipProps) => {
  const t = useTranslations();
  const formatNumber = useFormatNumber();
  const isDesktop = useIsDesktop();

  const query = useDiscoveryQuery();
  const baseline = useDiscoveryBaseline();
  const replaceQuery = useDiscoveryQueryReplace();
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedCount = countFilterGroup(
    extraDiscoveryFilters(query, baseline),
    keys,
  );
  const active = selectedCount > 0;

  const clear = () => {
    const body: Record<string, unknown> = { ...query };
    for (const key of keys) delete body[key];
    replaceQuery(body);
  };

  const face = (
    <>
      {icon ? <Icon name={icon} size={20} className="text-link" /> : null}
      <span>{active && label ? label : title}</span>
      {active && showCount ? (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-action px-1 text-2xs font-bold text-on-action md:h-5 md:min-w-5 md:px-1.5 md:text-xs">
          {formatNumber(selectedCount)}
        </span>
      ) : null}
      {active ? null : (
        <Icon name="chevron-down" size={16} className="text-ink-subtle" />
      )}
    </>
  );

  const clearButton = active ? (
    <button
      type="button"
      onClick={clear}
      aria-label={t("listing.removeFilterNamed", { title })}
      className="flex size-5 cursor-pointer items-center justify-center rounded-full border border-action"
    >
      <Icon name="x" size={16} />
    </button>
  ) : null;

  const chipClass = (open: boolean) =>
    `filter-chip ${active ? "filter-chip-active" : "filter-chip-idle"} ${open ? "!border-action" : ""}`;
  const faceClass = "flex h-full cursor-pointer items-center gap-1.5";

  if (isDesktop)
    return (
      <Popover className="relative shrink-0">
        {({ close, open }) => (
          <span className={chipClass(open)}>
            <PopoverButton className={faceClass}>{face}</PopoverButton>
            {clearButton}
            <PopoverPanel
              anchor={{ to: "bottom start", gap: 8, padding: 12 }}
              className={`z-50 max-h-[28rem] overflow-y-auto rounded-20 border border-line bg-surface p-4 shadow-elevated ${panelClass}`}
            >
              <p className="pb-2 text-base font-bold text-ink">{title}</p>
              <FilterEditorBody
                keys={keys}
                onDone={close}
                renderEditor={renderEditor}
              />
            </PopoverPanel>
          </span>
        )}
      </Popover>
    );

  return (
    <>
      <span className={chipClass(sheetOpen)}>
        <button
          type="button"
          className={faceClass}
          onClick={() => setSheetOpen(true)}
        >
          {face}
        </button>
        {clearButton}
      </span>

      <ModalBottomSheet show={sheetOpen} onHide={() => setSheetOpen(false)}>
        <ModalHeaderPart
          showX
          title={title}
          onHide={() => setSheetOpen(false)}
        />
        <div className="flex flex-col p-4 !pb-0">
          <FilterEditorBody
            keys={keys}
            renderEditor={renderEditor}
            onDone={() => setSheetOpen(false)}
          />
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default FilterEditorChip;
