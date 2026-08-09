import { useEffect, useMemo, useState } from "react";
import { BannerPosition } from "@/enum/banners.enum";
import { HomeService } from "@/api_services/home/home.service";
import { DeviceInfo } from "@/helpers/device.detector";
import { WeekDays } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import { isMobile } from "react-device-detect";

import HomeProductsBannerItems from "../Home/HomePropertiesList/HomeProductsBannerItems";
import LottieLoading from "../shared/Lotties/LottieLoading";
import PropertyCard from "../properties/PropertyCard";
import isUndefined from "lodash/isUndefined";
import EmptyList from "../shared/Lotties/EmptyList";
import moment from "moment-jalaali";

type SsrPartFilterType = {
  firstData: any;
  devices: DeviceInfo;
};

function SsrPartFilter({ firstData, devices }: SsrPartFilterType) {
  const [week, setWeek] = useState<any[]>([]);
  useEffect(() => {
    const dayOfWeek = moment().day();
    const weeks = [];
    for (let index = dayOfWeek; index < dayOfWeek + 7; index++) {
      const item = WeekDays?.find((e) => {
        if (index >= 7) return e?.id == index - 7;
        else return e?.id == index;
      });
      if (index < 7) weeks.push(item);
      else weeks.push(item);
    }
    setWeek(weeks);
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
    const arr = [...bannersList];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
          <LottieLoading />
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
            <EmptyList />
          </div>
        )}
      </div>
    </div>
  );
}

export default SsrPartFilter;
