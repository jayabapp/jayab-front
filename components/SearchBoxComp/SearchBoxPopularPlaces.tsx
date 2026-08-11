"use client";

import { LandingsPlacements } from "@/enum/landings.enum";
import { HomeService } from "@/api_services/home/home.service";
import { STALE_TIME } from "@/helpers/queryCache";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import _STRINGS from "@/utils/LocalStrings";

const SearchBoxPopularPlaces = ({
  setShowPop,
}: {
  setShowPop: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { push } = useRouter();
  const { data } = useQuery({
    queryKey: [HomeService.USER_LANDING_PAGES_KEY, LandingsPlacements.HOME],
    queryFn: () =>
      HomeService.getLandings({ placement: LandingsPlacements.HOME }),
    staleTime: STALE_TIME.MEDIUM,
  });
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
              className="flex px-3 cursor-pointer py-0.5 flex-row text-white   bg-primary-700 rounded-full transition-all  items-center gap-2"
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
