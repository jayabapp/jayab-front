import { SearchSuggDto } from "@/api_services/home/home.interface";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/navigation";
import React from "react";
import BtnLoading from "../shared/Button/BtnLoading";
const SuggestedPart = ({
  data,
  isLoading,
  searchedText,
  setShowPop,
}: {
  searchedText: string;
  isLoading: boolean;
  data?: SearchSuggDto | undefined | null;
  setShowPop: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const onCityClick = (id: string | number) => {
    let link = `/rooms?cities=${id}`;

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
    <div className=" flex items-start flex-col py-4 justify-start px-4 gap-4">
      {isLoading ? (
        <BtnLoading />
      ) : !!data && isEmpty(data?.cities) && isEmpty(data?.cities) && isEmpty(data?.properties) ? (
        <p>{_STRINGS.CANT_FIND}</p>
      ) : (
        <>
          {!isEmpty(data?.properties) ? (
            <div className="w-full flex flex-col gap-2">
              {data?.properties?.map((e) => (
                <div
                  onClick={() => {
                    onPropClick(e?.slug);
                  }}
                  key={`${e?.id}properties`}
                  className="flex cursor-pointer flex-row  grayscale transition-all  hover:grayscale-0 items-center gap-2"
                >
                  <img className="w-4  transition-all h-4 aspect-square" src="/assets/icons/edit/magnifier.svg" />{" "}
                  <p className=" text-primary-700 text-sm md:text-base transition-all">{e?.title} </p>
                </div>
              ))}
            </div>
          ) : (
            <> </>
          )}
          {!isEmpty(data?.cities) ? (
            <div className="w-full flex flex-col gap-2">
              <p className="font-medium">{_STRINGS.CITIES}</p>
              {data?.cities?.map((e) => (
                <div
                  onClick={() => {
                    onCityClick(e?.id);
                  }}
                  key={`${e?.id}CITIES`}
                  className="flex cursor-pointer flex-row  grayscale transition-all  hover:grayscale-0 items-center gap-2"
                >
                  <img
                    className="w-4  transition-all h-4 aspect-square"
                    src="/assets/icons/addresses/location_center.svg"
                  />{" "}
                  <p className=" text-primary-700 text-sm md:text-base transition-all">{e?.title} </p>
                </div>
              ))}
            </div>
          ) : (
            <> </>
          )}
          {!isEmpty(data?.landings) ? (
            <div className="w-full flex flex-col gap-2">
              <p className="font-medium">{_STRINGS.RELATED_RESULTS}</p>
              {data?.landings?.map((e) => (
                <div
                  onClick={() => {
                    onLandingClick(e?.url);
                  }}
                  key={`${e?.id}landings`}
                  className="flex cursor-pointer flex-row  grayscale transition-all  hover:grayscale-0 items-center gap-2"
                >
                  <img className="w-4  transition-all h-4 aspect-square" src="/assets/icons/edit/magnifier.svg" />{" "}
                  <p className=" text-primary-700 text-sm md:text-base transition-all">{e?.title} </p>
                </div>
              ))}
            </div>
          ) : (
            <> </>
          )}
        </>
      )}
    </div>
  );
};

export default SuggestedPart;
