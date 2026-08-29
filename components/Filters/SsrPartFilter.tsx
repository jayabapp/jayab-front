import { PropertyGridSkeleton } from "../Home/HomePropertiesList/PropertyGridSkeleton";
import { BannerPosition } from "@/enum/banners.enum";
import { HomeService } from "@/api_services/home/home.service";
import { DeviceInfo } from "@/helpers/device.detector";
import { WeekDays } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import { isMobile } from "react-device-detect";
import { useMemo } from "react";

import HomeProductsBannerItems from "../Home/HomePropertiesList/HomeProductsBannerItems";
import PropertyCard from "../properties/PropertyCard";
import isUndefined from "lodash/isUndefined";
import EmptyState from "@elements/EmptyState";
import moment from "moment-jalaali";

type SsrPartFilterType = {
  firstData: any;
  devices: DeviceInfo;
};

function SsrPartFilter({ firstData, devices }: SsrPartFilterType) {
  const week = useMemo(() => {
    const dayOfWeek = moment().day();
    return Array.from(
      { length: 7 },
      (_, offset) =>
        WeekDays.find((item) => item.id === (dayOfWeek + offset) % 7)?.title ??
        "",
    );
  }, []);
  const { data: banners } = useQuery({
    queryKey: [HomeService.BANNERS_RANDOM_CACHEKEY, BannerPosition.MAIN_2],
    queryFn: () => {
      return HomeService.GetBanners({ positions: [BannerPosition.MAIN_2] });
    },
  });

  const shuffledBanners = useMemo(() => {
    const bannersList = banners?.[BannerPosition.MAIN_2];
    if (!Array.isArray(bannersList) || bannersList.length === 0) return [];
    return [...bannersList];
  }, [banners]);

  const ITEMS_PER_BANNER = 6;
  const maxBanners =
    firstData.length > 0 ? Math.ceil(firstData.length / ITEMS_PER_BANNER) : 0;
  const visibleBanners = shuffledBanners.slice(0, maxBanners);
  const maxVisibleBanners = visibleBanners.splice(0, 2);
  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {isUndefined(firstData) ? (
          <PropertyGridSkeleton count={6} />
        ) : firstData?.length > 0 ? (
          <div className="grid   pb-2 pt-4 md:pt-2 px-1  !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-3 ">
            {maxVisibleBanners?.map((e: any, index: number) => (
              <div
                key={`banner${e?.id}`}
                className={`col-span-full`}
                style={{ gridRowStart: (index + 1) * (isMobile ? 7 : 3) }}
              >
                <HomeProductsBannerItems devices={devices} bannerItem={e} />
              </div>
            ))}
            {firstData?.map((i: any) => (
              <PropertyCard week={week} data={i} key={`PRODUCT${i?.id}`} />
            ))}
          </div>
        ) : (
          <div className="col-span-4">
            <EmptyState />
          </div>
        )}
      </div>
    </div>
  );
}

export default SsrPartFilter;
