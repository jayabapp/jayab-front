"use client";

import { Fragment, useEffect, useState } from "react";
import { weekFromToday } from "@/helpers/weekFromToday";
import { DeviceInfo } from "@/helpers/device.detector";

import HomeProductsBannerItems from "./HomeProductsBannerItems";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import PropertyCard from "@/components/properties/PropertyCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";

type HomePropertiesSsrPartType = {
  data: any;
  middleBanner?: any;
  devices?: DeviceInfo;
};

function HomePropertiesSsrPart({
  data,
  devices,
  middleBanner,
}: HomePropertiesSsrPartType) {
  const [week, setWeek] = useState<any[]>([]);
  useEffect(() => {
    setWeek(weekFromToday());
  }, []);

  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {!data ? (
          <LottieLoading />
        ) : data?.length > 0 ? (
          <div className="grid   pb-8 pt-2 md:pt-2 grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-4 ">
            {!!middleBanner ? (
              <div
                key={`Banner${middleBanner?.id}`}
                className="  col-span-full row-start-7 lg:row-start-3  "
              >
                <HomeProductsBannerItems
                  devices={devices}
                  bannerItem={middleBanner}
                />
              </div>
            ) : (
              <></>
            )}
            {data?.map((i: any) => {
              return (
                <Fragment key={`PRODUCT${i?.id}`}>
                  <PropertyCard week={week} data={i} key={`PRODUCT${i?.id}`} />
                </Fragment>
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
