"use client";

import { usePathname, useRouter } from "next/navigation";
import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import { SwiperSlide } from "swiper/react";
import { useRef } from "react";
import { Swiper } from "swiper";

import PropertilesFilterListItem from "./PropertilesFilterListItem";
import SwiperWithNavigation from "@/components/SwiperWithNavigation";
import queryBuilder from "@/helpers/queryBuilder";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import isEmpty from "lodash/isEmpty";

function PropertiesFilterList({
  data,
  query,
  propertyKey,
}: {
  propertyKey: string;
  query: any;
  data: ProvienceTypesDto[] | undefined;
}) {
  const ref = useRef<Swiper>(null);

  const router = useRouter();
  const pathname = usePathname();

  const queryMaker = (items: any) => {
    let temp = { ...query };
    const body = {
      ...temp,
      [propertyKey]: items,
    };
    if (temp[propertyKey] == items) delete body[propertyKey];
    delete body.page;
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <div
      className={` w-full noSelect   select-none   relative rounded-20 flex gap-4 flex-col items-center`}
    >
      {isEmpty(data) ? (
        <div className="  w-full flex items-center justify-center">
          {" "}
          <BtnLoading />
        </div>
      ) : (
        <SwiperWithNavigation
          reference={ref}
          className="!w-full  pr-3 !pb-2  "
          onBeforeInit={(swiper: Swiper) => (ref.current = swiper)}
          dataLength={1}
          grid={{ fill: "row", rows: 1 }}
          breakpoints={{
            320: {
              slidesPerView: 4.5,
              spaceBetween: 5,
              grid: { fill: "row", rows: 1 },
            },
            640: {
              slidesPerView: 4.5,
              spaceBetween: 5,
              grid: { fill: "row", rows: 1 },
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 10,
              grid: { fill: "row", rows: 1 },
            },
            1024: {
              slidesPerView: 7.5,
              spaceBetween: 15,
              grid: { fill: "row", rows: 1 },
            },
            1600: {
              slidesPerView: 8.5,
              spaceBetween: 15,
              grid: { fill: "row", rows: 1 },
            },
          }}
        >
          {data?.map((i, index: number) => (
            <SwiperSlide
              key={index}
              className={`w-full  !h-auto   p-0 md:py-2 cursor-pointer select-none md:px-2`}
            >
              <PropertilesFilterListItem
                isSelected={query?.[propertyKey] == i?.id}
                cb={() => {
                  queryMaker(i?.id);
                }}
                item={i}
                key={`${i?.title}${index}cat`}
              />
            </SwiperSlide>
          ))}
        </SwiperWithNavigation>
      )}
    </div>
  );
}

export default PropertiesFilterList;
