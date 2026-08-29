import type { HomePropertiesGridProps } from "@/types/components/modules/home";
import { Fragment } from "react";

import HomePropertiesBanner from "./HomePropertiesBanner.client";
import PropertyCard from "@/components/properties/PropertyCard";
import HomePropertiesSkeleton from "./HomePropertiesSkeleton";
import EmptyState from "@elements/EmptyState";

const HomePropertiesSsrPart = ({
  data,
  week,
  devices,
  middleBanner,
}: HomePropertiesGridProps) => {
  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {!data ? (
          <HomePropertiesSkeleton />
        ) : data?.length > 0 ? (
          <div className="grid   pb-8 pt-2 md:pt-2 grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-4 ">
            {!!middleBanner ? (
              <div
                key={`Banner${middleBanner?.id}`}
                className="  col-span-full row-start-7 lg:row-start-3  "
              >
                <HomePropertiesBanner
                  devices={devices}
                  bannerItem={middleBanner}
                />
              </div>
            ) : (
              <></>
            )}
            {data?.map((i) => {
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
};

export default HomePropertiesSsrPart;
