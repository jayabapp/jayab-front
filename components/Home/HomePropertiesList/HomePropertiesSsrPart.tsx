"use client";
import { HomeService } from "@/api_services/home/home.service";
import PropertyCard from "@/components/properties/PropertyCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { BannerPosition } from "@/enum/banners.enum";
import { DeviceInfo } from "@/helpers/device.detector";
import { WeekDays } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import moment from "moment-jalaali";
import { Fragment, useEffect, useMemo, useState } from "react";
import HomeProductsBannerItems from "./HomeProductsBannerItems";

type HomePropertiesSsrPartType = {
  data: any;
  middleBanners: any;
  devices?: DeviceInfo;
};

function HomePropertiesSsrPart({ data, middleBanners, devices }: HomePropertiesSsrPartType) {
  const [week, setWeek] = useState<any[]>([]);
  useEffect(() => {
    const dayOfWeek = moment().day();

    const weeks = [];
    for (let index = dayOfWeek; index < dayOfWeek + 7; index++) {
      const item = WeekDays?.find((e) => {
        if (index >= 7) {
          return e?.id == index - 7;
        } else {
          return e?.id == index;
        }
      });
      if (index < 7) {
        weeks.push(item);
      } else {
        weeks.push(item);
      }
    }

    setWeek(weeks);
  }, []);

  const { data: banners } = useQuery({
    queryKey: [HomeService.BANNERS_RANDOM_CACHEKEY, BannerPosition.MAIN_2],
    queryFn: () => {
      return HomeService.GetBanners({ position: BannerPosition.MAIN_2 });
    },
  });

  // const shuffledBanners = useMemo(() => {
  //   if (!Array.isArray(banners) || banners.length === 0) return [];
  //   const arr = [...banners];
  //   for (let i = arr.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [arr[i], arr[j]] = [arr[j], arr[i]];
  //   }
  //   return arr;
  // }, [banners]);

  const randomMiddleBanner = useMemo(() => {
    if (Array.isArray(banners) && banners.length > 0) {
      const idx = Math.floor(Math.random() * banners.length);
      return banners[idx];
    }
    return null;
  }, [banners]);
  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {!data ? (
          <LottieLoading />
        ) : data?.length > 0 ? (
          <div className="grid   pb-8 pt-2 md:pt-2 grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-4 ">
            {!!randomMiddleBanner ? (
              <div key={`Banner${randomMiddleBanner?.id}`} className="  col-span-full row-start-7 lg:row-start-3  ">
                <HomeProductsBannerItems devices={devices} bannerItem={randomMiddleBanner} />
              </div>
            ) : (
              <></>
            )}
            {data?.map((i: any, index: number) => {
              return (
                <Fragment key={`PRODUCT${i?.id}`}>
                  <PropertyCard week={week} data={i} key={`PRODUCT${i?.id}`} />
                  {/* {(index + 1) % 8 == 0 && !!bannerItem?.[0] && !!bannerItem?.[1] ? (
                    <div
                      key={`banenr${i?.id}`}
                      className="w-full  py-2 col-span-full gap-4  grid  grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 "
                    >
                      <HomeProductsBannerItems bannerItem={bannerItem?.[1]} />
                    </div>
                  ) : (
                    <></>
                  )} */}
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
