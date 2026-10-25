type RuleOption = {
  title: string;
  id: string | number;
  canonical_title?: string;
};

type OptionGroups = Record<string, RuleOption[]> | undefined;

const DISALLOWED_RULE_TITLE = "مجاز نیست";

export const RULE_KEYS = ["party", "pet"] as const;

const RULE_GROUPS = { party: "PARTY", pet: "PET" } as const;

export const getAllowedRuleIds = (options: RuleOption[] = []) =>
  options
    .filter(
      (option) =>
        (option.canonical_title ?? option.title).trim() !==
        DISALLOWED_RULE_TITLE,
    )
    .map((option) => option.id)
    .join(",");

export const getRuleOptions = (
  groups: OptionGroups,
  titles: Record<(typeof RULE_KEYS)[number], string>,
  hidden: readonly string[] = [],
) =>
  RULE_KEYS.map((queryKey) => ({
    queryKey,
    title: titles[queryKey],
    id: getAllowedRuleIds(groups?.[RULE_GROUPS[queryKey]]),
  })).filter((rule) => rule.id && !hidden.includes(rule.queryKey));
