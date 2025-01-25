"use client";
import Editable from "@/components/Editable";
import PropertyCard from "@/components/properties/PropertyCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { chunk, isEmpty } from "lodash";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import HomeProductsBannerItems from "./HomeProductsBannerItems";

type HomePropertiesSsrPartType = {
  data: any;
  middleBanners: any;
};

function HomePropertiesSsrPart({ data, middleBanners }: HomePropertiesSsrPartType) {
  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {!data ? (
          <LottieLoading />
        ) : data?.length > 0 ? (
          <div className="grid   pb-8 pt-4 md:pt-2 px-1  !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-4 ">
            {data?.map((i: any, index: number) => {
              const bannerItem = !isEmpty(middleBanners) ? middleBanners[Math.floor(index / 8)] : [];
              return (
                <>
                  <PropertyCard data={i} key={`PRODUCT${i?.id}`} />
                  {(index + 1) % 8 == 0 && !!bannerItem?.[0] && !!bannerItem?.[1] ? (
                    <div
                      key={`banenr${i?.id}`}
                      className="w-full  py-2 col-span-full gap-4  grid  grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 "
                    >
                      <HomeProductsBannerItems bannerItem={bannerItem?.[0]} />
                      <HomeProductsBannerItems bannerItem={bannerItem?.[1]} />
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
          </div>
        ) : (
          <div className="col-span-4">
            <EmptyList />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePropertiesSsrPart;
