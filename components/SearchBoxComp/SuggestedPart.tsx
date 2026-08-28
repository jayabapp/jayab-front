import { SuggestionRowSkeleton } from "./SuggestionRowSkeleton";
import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";
import { CitySuggestDto } from "@/api_services/home/home.interface";
import { useCitiesStore } from "@/store";
import { SearchSuggDto } from "@/api_services/home/home.interface";
import { useRouter } from "next/navigation";

import HistoryMaker from "./HistoryMaker";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

type TSuggestedProps = {
  isLoading: boolean;
  searchedText: string;
  data?: SearchSuggDto | undefined | null;
  setShowPop: React.Dispatch<React.SetStateAction<boolean>>;
};

const SuggestedPart = ({
  data,
  isLoading,
  setShowPop,
  searchedText,
}: TSuggestedProps) => {
  const router = useRouter();

  const onCityClick = (city: CitySuggestDto) => {
    let link = ``;
    const body: any = {};
    if (city?.level == CitiesSuggestTypes?.CITY) {
      body.cities = [{ title: city?.title, id: city?.id }];
      link = `/rooms?cities=${city?.id}`;
    }
    if (city?.level == CitiesSuggestTypes?.PROVINCE) {
      link = `/rooms?provinces=${city?.id}`;
      body.provinces = [{ id: city?.id, title: city?.title }];
    }

    if (city?.level == CitiesSuggestTypes?.REGION) {
      body.cities = [{ title: city?.parent_title, id: city?.parent_id }];
      body.regions = [city];
      link = `/rooms?cities=${city?.parent_id}&regions=${city?.id}`;
    }
    useCitiesStore.setState({
      locationsData: body,
    });
    setShowPop(false);
    router.push(link);
  };

  const onLandingClick = (slug: string | number) => {
    let link = `/${slug}`;
    setShowPop(false);
    router.push(link);
  };

  const onPropClick = (slug: string | number) => {
    let link = `/rooms/${slug}`;
    setShowPop(false);
    router.push(link);
  };

  return (
    <div className=" flex items-start flex-col w-full py-4 justify-start px-4 gap-2">
      {isLoading ? (
        <SuggestionRowSkeleton />
      ) : !!data &&
        isEmpty(data?.cities) &&
        isEmpty(data?.properties) &&
        isEmpty(data?.landings) ? (
        <></>
      ) : (
        <>
          {!isEmpty(data?.properties) ? (
            <div className="w-full flex flex-col gap-2">
              {data?.properties?.map((e) => (
                <div
                  onClick={() => {
                    HistoryMaker(searchedText);
                    onPropClick(e?.slug);
                  }}
                  key={`${e?.id}properties`}
                  className="flex cursor-pointer flex-row  grayscale transition-all  hover:grayscale-0 items-center gap-2"
                >
                  <img
                    className="w-4  transition-all h-4 aspect-square"
                    src="/assets/icons/edit/magnifier.svg"
                  />{" "}
                  <p className=" text-brand-600 text-sm md:text-base transition-all">
                    {e?.title}{" "}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          {!isEmpty(data?.cities) ? (
            <div className="w-full flex flex-col gap-3">
              {data?.cities?.map((e) => (
                <div
                  onClick={() => {
                    HistoryMaker(searchedText);
                    onCityClick(e);
                  }}
                  key={`${e?.id}CITIES`}
                  className="flex cursor-pointer flex-row  grayscale transition-all  hover:grayscale-0 items-center gap-2"
                >
                  <img
                    className="w-4  transition-all h-4 aspect-square"
                    src="/assets/icons/home/literly_map.svg"
                  />{" "}
                  <p className=" text-brand-600 text-sm md:text-base transition-all">
                    {" "}
                    {e?.level == "province"
                      ? _STRINGS.PROVINCE
                      : e?.level == "city"
                        ? _STRINGS.CITY
                        : ""}{" "}
                    {e?.title}{" "}
                    {e?.level == "region" ? (
                      <span className="  opacity-70 text-xs ">
                        {" "}
                        {`(${e?.parent_title})`}{" "}
                      </span>
                    ) : (
                      ""
                    )}{" "}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          {!isEmpty(data?.landings) ? (
            <div className="w-full flex flex-col gap-2">
              <p className="font-medium">{_STRINGS.RELATED_RESULTS}</p>
              {data?.landings?.map((e) => (
                <div
                  onClick={() => {
                    HistoryMaker(searchedText);
                    onLandingClick(e?.url);
                  }}
                  key={`${e?.id}landings`}
                  className="flex cursor-pointer flex-row  grayscale transition-all  hover:grayscale-0 items-center gap-2"
                >
                  <img
                    className="w-4  transition-all h-4 aspect-square"
                    src="/assets/icons/edit/magnifier.svg"
                  />{" "}
                  <p className=" text-brand-600 text-sm md:text-base transition-all">
                    {e?.title}{" "}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default SuggestedPart;
