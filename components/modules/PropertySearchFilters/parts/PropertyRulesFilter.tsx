import { countFilterGroup } from "@features/properties/lib/count-active-filters";
import { useTranslations } from "next-intl";

import type { PropertyRulesFilterProps } from "@/types/components/modules/property-search-filters";

import PropertyModelFilter from "../PropertyModelFilter.client";
import FilterSection from "./FilterSection.client";

const DISALLOWED_RULE_TITLE = "مجاز نیست";

const getAllowedRuleIds = (
  options: {
    id: string | number;
    title: string;
    canonical_title?: string;
  }[] = [],
) =>
  options
    // The Persian title is the stable one; `title` follows the page language.
    .filter(
      (option) =>
        (option.canonical_title ?? option.title).trim() !==
        DISALLOWED_RULE_TITLE,
    )
    .map((option) => option.id)
    .join(",");

const PropertyRulesFilter = ({
  filters,
  queries,
  setFilters,
  propertyTypes,
  hiddenFilters = [],
  countFilters = filters,
}: PropertyRulesFilterProps) => {
  const t = useTranslations("listing");

  const rules = [
    {
      id: getAllowedRuleIds(propertyTypes?.PARTY),
      queryKey: "party",
      title: t("party"),
    },
    {
      id: getAllowedRuleIds(propertyTypes?.PET),
      queryKey: "pet",
      title: t("pet"),
    },
  ].filter((rule) => rule.id && !hiddenFilters.includes(rule.queryKey));

  if (!rules.length) return null;

  return (
    <FilterSection
      title={t("accommodationRules")}
      count={countFilterGroup(
        countFilters,
        rules.map((rule) => rule.queryKey),
      )}
    >
      {rules.map((rule) => (
        <PropertyModelFilter
          query={queries}
          key={rule.queryKey}
          mobileFilters={filters}
          queryKey={rule.queryKey}
          setMobileFilters={setFilters}
          list={[{ id: rule.id, title: rule.title }]}
        />
      ))}
    </FilterSection>
  );
};

export default PropertyRulesFilter;
