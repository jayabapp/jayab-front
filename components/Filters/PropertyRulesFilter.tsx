import { Dispatch } from "react";

import SimpleAccordion from "@/components/shared/SimpleAccorion";
import _STRINGS from "@/utils/LocalStrings";
import ProductModels from "./ProductModelx";

type PropertyRuleOption = {
  id: string | number;
  title: string;
};

type PropertyRulesFilterProps = {
  hiddenFilters?: string[];
  filters: Record<string, unknown>;
  queries: Record<string, unknown>;
  setFilters: Dispatch<Record<string, unknown>>;
  propertyTypes?: Record<string, PropertyRuleOption[]>;
};

const getAllowedRuleIds = (options: PropertyRuleOption[] = []) =>
  options
    .filter((option) => option.title.trim() !== "مجاز نیست")
    .map((option) => option.id)
    .join(",");

const PropertyRulesFilter = ({
  filters,
  hiddenFilters = [],
  propertyTypes,
  queries,
  setFilters,
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
      item={{
        parenClass: "pb-2 border-b w-full p-2 !px-0",
        disableBorderB: true,
      }}
      title={_STRINGS.ACCOMMODATION_RULES}
    >
      {rules.map((rule) => (
        <ProductModels
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
