import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { isEmpty } from "lodash";
import _STRINGS from "@/utils/LocalStrings";
import BtnLoading from "../shared/Button/BtnLoading";
import findTree from "@/helpers/FindTree";
const SuggestedPart = ({
  data,
  isLoading,
  searchedText,
  setShowPop,
}: {
  searchedText: string;
  isLoading: boolean;
  data: any | undefined;
  setShowPop: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const onSuggClick = (path: string, id: string | number, withQ?: boolean) => {
    const pathArray = findTree(path);
    let link = "";
    if (!!withQ) {
      if (pathArray[0] == id) {
        link = `/products?parent_category=${id}&q=${searchedText}`;
      } else {
        link = `/products?parent_category=${pathArray[0]}&categories=${id}&q=${searchedText}`;
      }
    } else {
      if (pathArray[0] == id) {
        link = `/products?sort_type=new&parent_category=${id}`;
      } else {
        link = `/products?sort_type=new&parent_category=${pathArray[0]}&categories=${id}`;
      }
    }
    setShowPop(false);
    router.push(link);
  };

  return (
    <div className=" flex items-start flex-col py-4 justify-start gap-4">
      {isLoading ? (
        <BtnLoading />
      ) : !!data && isEmpty(data?.categories) && isEmpty(data?.autocomplete) ? (
        <p>{_STRINGS.CANT_FIND}</p>
      ) : (
        <>
          <div className="w-full flex flex-col gap-2">
            {data?.categories?.map((e: any) => (
              <div
                onClick={() => {
                  onSuggClick(e?.path, e?.id);
                }}
                key={`${e?.id}cats`}
                className="flex cursor-pointer  grayscale transition-all  hover:grayscale-0 items-center gap-2"
              >
                <img className="w-4  transition-all h-4 aspect-square" src="/assets/icons/footer/tour_category.svg" />{" "}
                <p className=" text-primary-700 text-sm md:text-base transition-all">{e?.title} </p>
              </div>
            ))}
          </div>
          <div className="w-full flex flex-col gap-2">
            {" "}
            {data?.autocomplete?.map((e: any) => (
              <div
                onClick={() => {
                  onSuggClick(e?.category?.path, e?.category?.id, true);
                }}
                key={e?.category?.id}
                className=" cursor-pointer flex gap-0 flex-col"
              >
                <div className="flex items-center gap-2">
                  <img className="" src="/assets/icons/home/magnifier.svg" />
                  <span className="text-sm ">{searchedText}</span>
                </div>
                <p className="text-sm ">
                  {" "}
                  در دسته بندی <span className="md:text-base text-primary-700 ">{e?.category?.title}</span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SuggestedPart;
