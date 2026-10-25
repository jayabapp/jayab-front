"use client";

import { useTranslations } from "next-intl";
import { getRuleOptions } from "@features/properties/lib/rule-options";

import type { RulesFilterChipProps } from "@/types/components/modules/property-search-filters";

import PropertyModelFilter from "../PropertyModelFilter.client";
import FilterEditorChip from "./FilterEditorChip.client";

const RulesFilterChip = ({ propertyTypes }: RulesFilterChipProps) => {
  const t = useTranslations("listing");
  const rules = getRuleOptions(propertyTypes, {
    party: t("party"),
    pet: t("pet"),
  });

  if (!rules.length) return null;

  return (
    <FilterEditorChip
      icon="shield"
      showCount
      panelClass="w-72"
      title={t("accommodationRules")}
      keys={rules.map((rule) => rule.queryKey)}
      renderEditor={(draft, setDraft) => (
        <>
          {rules.map((rule) => (
            <PropertyModelFilter
              query={draft}
              key={rule.queryKey}
              mobileFilters={draft}
              queryKey={rule.queryKey}
              setMobileFilters={setDraft}
              list={[{ id: rule.id, title: rule.title }]}
            />
          ))}
        </>
      )}
    />
  );
};

export default RulesFilterChip;
