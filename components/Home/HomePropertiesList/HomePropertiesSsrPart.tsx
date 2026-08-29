import { PropertyGridSkeleton } from "./PropertyGridSkeleton";
import { DeviceInfo } from "@/helpers/device.detector";
import { Fragment } from "react";

import HomeProductsBannerItems from "./HomeProductsBannerItems";
import PropertyCard from "@/components/properties/PropertyCard";
import EmptyState from "@elements/EmptyState";

type HomePropertiesSsrPartType = {
  data: any;
  week: any[];
  middleBanner?: any;
  devices?: DeviceInfo;
};

function HomePropertiesSsrPart({
  data,
  week,
  devices,
  middleBanner,
}: HomePropertiesSsrPartType) {
  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {!data ? (
          <PropertyGridSkeleton />
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
            <EmptyState />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePropertiesSsrPart;
