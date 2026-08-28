"use client";

import { useHomeLandings } from "@features/search/hooks/useHomeLandings";
import { useRouter } from "next/navigation";

import _STRINGS from "@/utils/LocalStrings";

const SearchBoxPopularPlaces = ({
  setShowPop,
}: {
  setShowPop: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { push } = useRouter();
  const { data } = useHomeLandings();
  const onLandingClick = (url: string) => {
    setShowPop(false);
    push(url);
  };
  return (
    <div className=" flex flex-col items-start  w-full px-4   pb-2 justify-start gap-2">
      <div className="flex flex-col items-start w-full justify-start gap-2 mt-2 pt-2 border-t ">
        <p className="  text-sm md:text-base md:font-medium ">
          {_STRINGS.MOST_VISITED_DESTINATIONS}
        </p>
        <div className=" flex items-center justify-start gap-3 ">
          {data?.popular_city?.slice(0, 4)?.map((e) => (
            <div
              onClick={(x) => {
                x.stopPropagation();
                x.preventDefault();
                onLandingClick(e?.url);
              }}
              key={`${e?.url}landings`}
              className="flex px-3 cursor-pointer py-0.5 flex-row text-white   bg-brand-600 rounded-full transition-all  items-center gap-2"
            >
              <p className="  text-sm   transition-all">{e?.title} </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBoxPopularPlaces;
