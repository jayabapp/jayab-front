import type { CitySuggestDto, SearchSuggDto } from "@/api_services/home/home.interface";
import type { SearchOption } from "@/types/features/search";
import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";

/**
 * Flattens the three separate arrays the suggestions endpoint returns into one
 * ordered list.
 *
 * The panel used to render `properties`, `cities` and `landings` as three
 * independent blocks of near-identical buttons, which meant there was no single
 * sequence to move a keyboard cursor along and no way for a reader to tell a
 * place from a listing from a guide page. One list with a `kind` on every entry
 * gives both: the group headers are derived at render time, and arrow keys walk
 * straight through them.
 *
 * Places come first because a location is what a guest is usually choosing;
 * a specific listing is a rarer, more deliberate hit.
 */

/** The `/rooms` filter a place stands for, plus the chips that page should show. */
const placeTarget = (city: CitySuggestDto) => {
  if (city?.level === CitiesSuggestTypes.PROVINCE)
    return {
      href: `/rooms?provinces=${city?.id}`,
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
    href: `/rooms?cities=${city?.id}`,
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
