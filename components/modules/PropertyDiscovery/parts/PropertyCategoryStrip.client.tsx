"use client";

import type { PropertyCategoryStripProps } from "@/types/components/modules/property-discovery";
import { usePathname, useRouter } from "next/navigation";
import { BtnLoading } from "@elements/Button";
import { SwiperSlide } from "swiper/react";
import type { Swiper } from "swiper";
import { useRef } from "react";

import SwiperWithNavigation from "@/components/SwiperWithNavigation";
import PropertyCategoryItem from "./PropertyCategoryItem";
import queryBuilder from "@/helpers/queryBuilder";
import isEmpty from "lodash/isEmpty";

const CATEGORY_BREAKPOINTS = {
  320: { slidesPerView: 4.5, spaceBetween: 5, grid: { fill: "row", rows: 1 } },
  640: { slidesPerView: 4.5, spaceBetween: 5, grid: { fill: "row", rows: 1 } },
  768: { slidesPerView: 5, spaceBetween: 10, grid: { fill: "row", rows: 1 } },
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
};

const PropertyCategoryStrip = ({
  data,
  query,
  propertyKey,
}: PropertyCategoryStripProps) => {
  const reference = useRef<Swiper>(null);
  const router = useRouter();
  const pathname = usePathname();

  const toggleCategory = (id: string | number) => {
    const body: Record<string, unknown> = { ...query, [propertyKey]: id };
    if (query?.[propertyKey] === id || `${query?.[propertyKey]}` === `${id}`)
      delete body[propertyKey];
    delete body.page;
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <div className="w-full noSelect select-none relative rounded-20 flex gap-4 flex-col items-center">
      {isEmpty(data) ? (
        <div className="w-full flex items-center justify-center">
          <BtnLoading />
        </div>
      ) : (
        <SwiperWithNavigation
          dataLength={1}
          reference={reference}
          className="!w-full pr-3 !pb-2"
          grid={{ fill: "row", rows: 1 }}
          breakpoints={CATEGORY_BREAKPOINTS}
          onBeforeInit={(swiper: Swiper) => (reference.current = swiper)}
        >
          {data?.map((item) => (
            <SwiperSlide
              key={`category-${item?.id}`}
              className="w-full !h-auto p-0 md:py-2 cursor-pointer select-none md:px-2"
            >
              <PropertyCategoryItem
                item={item}
                cb={() => toggleCategory(item?.id)}
                isSelected={`${query?.[propertyKey]}` === `${item?.id}`}
              />
            </SwiperSlide>
          ))}
        </SwiperWithNavigation>
      )}
    </div>
  );
};

export default PropertyCategoryStrip;
