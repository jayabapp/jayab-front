import type { PropertyRulesFilterProps } from "@/types/components/modules/property-search-filters";

import SimpleAccordion from "@/components/shared/SimpleAccorion";
import PropertyModelFilter from "../PropertyModelFilter.client";
import _STRINGS from "@/utils/LocalStrings";

const DISALLOWED_RULE_TITLE = "مجاز نیست";

const getAllowedRuleIds = (
  options: { id: string | number; title: string }[] = [],
) =>
  options
    .filter((option) => option.title.trim() !== DISALLOWED_RULE_TITLE)
    .map((option) => option.id)
    .join(",");

const PropertyRulesFilter = ({
  filters,
  queries,
  setFilters,
  propertyTypes,
  hiddenFilters = [],
}: PropertyRulesFilterProps) => {
  const rules = [
    {
      id: getAllowedRuleIds(propertyTypes?.PARTY),
      queryKey: "party",
      title: _STRINGS.PARTY,
    },
    {
      id: getAllowedRuleIds(propertyTypes?.PET),
      queryKey: "pet",
      title: _STRINGS.PET,
    },
  ].filter((rule) => rule.id && !hiddenFilters.includes(rule.queryKey));

  if (!rules.length) return null;

  return (
    <SimpleAccordion
      title={_STRINGS.ACCOMMODATION_RULES}
      item={{
        parenClass: "pb-2 border-b w-full p-2 !px-0",
        disableBorderB: true,
      }}
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
    </SimpleAccordion>
  );
};

export default PropertyRulesFilter;
