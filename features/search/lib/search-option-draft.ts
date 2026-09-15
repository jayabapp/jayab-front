import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";

import type { HeroSearchDraft, SearchOption } from "@/types/features/search";

export const CLEARED_DRAFT_TARGET: Partial<HeroSearchDraft> = {
  cities: undefined,
  provinces: undefined,
  regions: undefined,
  landingUrl: undefined,
  propertyHref: undefined,
};

const LABEL_SEPARATOR = "، ";

export const searchOptionToDraft = (
  option: SearchOption,
): Partial<HeroSearchDraft> => {
  const base = {
    ...CLEARED_DRAFT_TARGET,
    q: option.label,
    cityTitle: option.label,
  };

  if (option.kind === "property") return { ...base, propertyHref: option.href };
  if (option.kind === "guide") return { ...base, landingUrl: option.href };

  const city = option.city;
  const landingUrl = option.href.startsWith("/rooms") ? undefined : option.href;

  if (city?.level === CitiesSuggestTypes.REGION)
    return {
      ...base,
      regions: `${city.id}`,
      cities: city.parent_id ? `${city.parent_id}` : undefined,
      cityTitle: [city.title, city.parent_title]
        .filter(Boolean)
        .join(LABEL_SEPARATOR),
    };

  if (city?.level === CitiesSuggestTypes.PROVINCE)
    return { ...base, provinces: `${city.id}`, landingUrl };

  return {
    ...base,
    cities: city?.id ? `${city.id}` : undefined,
    landingUrl,
  };
};
