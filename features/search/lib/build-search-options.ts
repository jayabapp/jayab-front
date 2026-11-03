import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";

import type { CitySuggestDto } from "@/api_services/home/home.interface";
import type { SearchSuggDto } from "@/api_services/home/home.interface";
import type { LocationWords } from "@features/cities/lib/location-label";
import type { SearchOption } from "@/types/features/search";

const placeHint = (city: CitySuggestDto, words: LocationWords) => {
  if (city?.level === CitiesSuggestTypes.PROVINCE) return "";
  if (city?.level === CitiesSuggestTypes.REGION)
    return [city?.parent_title, city?.grandparent_title]
      .filter(Boolean)
      .join(words.separator);
  return city?.parent_title ? `${words.province} ${city.parent_title}` : "";
};

const placeBadge = (level: string | undefined, words: LocationWords) => {
  if (level === CitiesSuggestTypes.PROVINCE) return words.province;
  if (level === CitiesSuggestTypes.CITY) return words.city;
  if (level === CitiesSuggestTypes.REGION) return words.local;
  return undefined;
};

const placeTarget = (city: CitySuggestDto) => {
  if (city?.level === CitiesSuggestTypes.PROVINCE)
    return {
      href: city.target || `/rooms?provinces=${city?.id}`,
      locations: { provinces: [{ id: city?.id, title: city?.title }] },
    };
  if (city?.level === CitiesSuggestTypes.REGION)
    return {
      href: `/rooms?cities=${city?.parent_id}&regions=${city?.id}`,
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
  data: SearchSuggDto | null | undefined,
  words: LocationWords,
  codeWord: string,
): SearchOption[] => [
  ...(data?.cities ?? []).map<SearchOption>((city) => ({
    id: `city-${city?.id}`,
    kind: "place",
    label: city?.title ?? "",
    hint: placeHint(city, words),
    badge: placeBadge(city?.level, words),
    city,
    ...placeTarget(city),
  })),
  ...(data?.properties ?? []).map<SearchOption>((property) => ({
    id: `property-${property?.id}`,
    kind: "property",
    label: property?.title ?? "",
    code: property?.code,
    hint: property?.code ? `${codeWord} ${property.code}` : undefined,
    href: `/rooms/${property?.slug}`,
  })),
  ...(data?.landings ?? []).map<SearchOption>((landing) => ({
    id: `landing-${landing?.id}`,
    kind: "guide",
    label: landing?.title ?? "",
    href: `/${landing?.url}`,
  })),
];
