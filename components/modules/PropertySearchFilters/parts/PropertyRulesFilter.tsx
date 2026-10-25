import { countFilterGroup } from "@features/properties/lib/count-active-filters";
import { getRuleOptions } from "@features/properties/lib/rule-options";
import { useTranslations } from "next-intl";

import type { PropertyRulesFilterProps } from "@/types/components/modules/property-search-filters";

import PropertyModelFilter from "../PropertyModelFilter.client";
import FilterSection from "./FilterSection.client";

const PropertyRulesFilter = ({
  filters,
  queries,
  setFilters,
  propertyTypes,
  hiddenFilters = [],
  countFilters = filters,
}: PropertyRulesFilterProps) => {
  const t = useTranslations("listing");

  const rules = getRuleOptions(
    propertyTypes,
    { party: t("party"), pet: t("pet") },
    hiddenFilters,
  );

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
