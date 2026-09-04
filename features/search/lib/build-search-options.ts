import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";

import type { CitySuggestDto } from "@/api_services/home/home.interface";
import type { SearchSuggDto } from "@/api_services/home/home.interface";
import type { SearchOption } from "@/types/features/search";

const placeTarget = (city: CitySuggestDto) => {
  if (city?.level === CitiesSuggestTypes.PROVINCE)
    return {
      href: city.target || `/rooms?provinces=${city?.id}`,
      locations: { provinces: [{ id: city?.id, title: city?.title }] },
    };
  if (city?.level === CitiesSuggestTypes.REGION)
    return {
      href:
        city.target || `/rooms?cities=${city?.parent_id}&regions=${city?.id}`,
      locations: {
        cities: [{ id: city?.parent_id, title: city?.parent_title }],
        regions: [city],
      },
    };
  return {
    href: city.target || `/rooms?cities=${city?.id}`,
    locations: { cities: [{ id: city?.id, title: city?.title }] },
  };
};

export const buildSearchOptions = (
  data?: SearchSuggDto | null,
): SearchOption[] => [
  ...(data?.cities ?? []).map<SearchOption>((city) => ({
    id: `city-${city?.id}`,
    kind: "place",
    label: city?.title ?? "",
    hint: city?.parent_title || "",
    city,
    ...placeTarget(city),
  })),
  ...(data?.properties ?? []).map<SearchOption>((property) => ({
    id: `property-${property?.id}`,
    kind: "property",
    label: property?.title ?? "",
    href: `/rooms/${property?.slug}`,
  })),
  ...(data?.landings ?? []).map<SearchOption>((landing) => ({
    id: `landing-${landing?.id}`,
    kind: "guide",
    label: landing?.title ?? "",
    href: `/${landing?.url}`,
  })),
];
