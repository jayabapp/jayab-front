"use client";

import type { CitySuggestDto, SearchSuggestionsProps } from "@/types/components/modules/search";
import { useSearchHistory } from "@features/search/hooks/useSearchHistory";
import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";
import { ContentImage } from "@elements/Image";
import { useRouter } from "next/navigation";
import { useCitiesStore } from "@/store";

import SuggestionRowSkeleton from "./SuggestionRowSkeleton";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

const cityLevelLabel = (level?: string) => {
  if (level === CitiesSuggestTypes.PROVINCE) return _STRINGS.PROVINCE;
  if (level === CitiesSuggestTypes.CITY) return _STRINGS.CITY;
  return "";
};

/** Maps a city suggestion onto the `/rooms` filter it stands for. */
const cityTarget = (city: CitySuggestDto) => {
  if (city?.level === CitiesSuggestTypes.PROVINCE) {
    return {
      href: `/rooms?provinces=${city?.id}`,
      locations: { provinces: [{ id: city?.id, title: city?.title }] },
    };
  }
  if (city?.level === CitiesSuggestTypes.REGION) {
    return {
      href: `/rooms?cities=${city?.parent_id}&regions=${city?.id}`,
      locations: {
        cities: [{ id: city?.parent_id, title: city?.parent_title }],
        regions: [city],
      },
    };
  }
  return {
    href: `/rooms?cities=${city?.id}`,
    locations: { cities: [{ id: city?.id, title: city?.title }] },
  };
};

const SearchSuggestions = ({
  data,
  isLoading,
  onClose,
  searchedText,
}: SearchSuggestionsProps) => {
  const router = useRouter();
  const { remember } = useSearchHistory();

  const navigate = (href: string) => {
    remember(searchedText);
    onClose();
    router.push(href);
  };

  const onCityClick = (city: CitySuggestDto) => {
    const { href, locations } = cityTarget(city);
    useCitiesStore.setState({ locationsData: locations });
    navigate(href);
  };

  const isEmptyResult =
    !!data && isEmpty(data?.cities) && isEmpty(data?.properties) && isEmpty(data?.landings);

  return (
    <div className="flex items-start flex-col w-full py-4 justify-start px-4 gap-2">
      {isLoading ? (
        <SuggestionRowSkeleton />
      ) : isEmptyResult ? null : (
        <>
          {isEmpty(data?.properties) ? null : (
            <div className="w-full flex flex-col gap-2">
              {data?.properties?.map((property) => (
                <button
                  type="button"
                  key={`property-${property?.id}`}
                  onClick={() => navigate(`/rooms/${property?.slug}`)}
                  className="flex cursor-pointer flex-row grayscale transition-all hover:grayscale-0 items-center gap-2"
                >
                  <ContentImage
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 transition-all h-4 aspect-square"
                    src="/assets/icons/edit/magnifier.svg"
                  />
                  <span className="text-brand-600 text-sm md:text-base transition-all">
                    {property?.title}
                  </span>
                </button>
              ))}
            </div>
          )}

          {isEmpty(data?.cities) ? null : (
            <div className="w-full flex flex-col gap-3">
              {data?.cities?.map((city) => (
                <button
                  type="button"
                  key={`city-${city?.id}`}
                  onClick={() => onCityClick(city)}
                  className="flex cursor-pointer flex-row grayscale transition-all hover:grayscale-0 items-center gap-2"
                >
                  <ContentImage
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 transition-all h-4 aspect-square"
                    src="/assets/icons/home/literly_map.svg"
                  />
                  <span className="text-brand-600 text-sm md:text-base transition-all">
                    {cityLevelLabel(city?.level)} {city?.title}
                    {city?.level === CitiesSuggestTypes.REGION ? (
                      <span className="opacity-70 text-xs"> {`(${city?.parent_title})`}</span>
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          )}

          {isEmpty(data?.landings) ? null : (
            <div className="w-full flex flex-col gap-2">
              <p className="font-medium">{_STRINGS.RELATED_RESULTS}</p>
              {data?.landings?.map((landing) => (
                <button
                  type="button"
                  key={`landing-${landing?.id}`}
                  onClick={() => navigate(`/${landing?.url}`)}
                  className="flex cursor-pointer flex-row grayscale transition-all hover:grayscale-0 items-center gap-2"
                >
                  <ContentImage
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 transition-all h-4 aspect-square"
                    src="/assets/icons/edit/magnifier.svg"
                  />
                  <span className="text-brand-600 text-sm md:text-base transition-all">
                    {landing?.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchSuggestions;
