"use client";

import type { SearchPopularPlacesProps } from "@/types/components/modules/search";
import { useHomeLandings } from "@features/search/hooks/useHomeLandings";
import { useRouter } from "next/navigation";

import _STRINGS from "@/utils/LocalStrings";

const POPULAR_PLACE_COUNT = 4;

const SearchPopularPlaces = ({ onClose }: SearchPopularPlacesProps) => {
  const { push } = useRouter();
  const { data } = useHomeLandings();

  return (
    <div className="flex flex-col items-start w-full px-4 pb-2 justify-start gap-2">
      <div className="flex flex-col items-start w-full justify-start gap-2 mt-2 pt-2 border-t">
        <p className="text-sm md:text-base md:font-medium">
          {_STRINGS.MOST_VISITED_DESTINATIONS}
        </p>
        <div className="flex items-center justify-start gap-3">
          {data?.popular_city?.slice(0, POPULAR_PLACE_COUNT)?.map((landing) => (
            <button
              type="button"
              key={`landing-${landing?.url}`}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                onClose();
                push(landing?.url);
              }}
              className="flex px-3 cursor-pointer py-0.5 flex-row text-white bg-brand-600 rounded-full transition-all items-center gap-2"
            >
              <span className="text-sm transition-all">{landing?.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPopularPlaces;
