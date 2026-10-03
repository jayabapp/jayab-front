"use client";

import {
  HOME_TILE_BREAKPOINTS,
  HOME_TILE_DEFAULT_SLIDES_PER_VIEW,
  HOME_TILE_DEFAULT_SPACE_BETWEEN,
} from "@modules/HomeSearch/tile-breakpoints";

import type { HomeCitiesProps } from "@/types/components/modules/home";

import SwiperSlide from "@elements/Carousel/SwiperSlide";
import Swiper from "@elements/Carousel/Swiper.client";
import HomeCityItem from "./parts/HomeCityItem.client";

const splitIntoColumns = (data: HomeCitiesProps["data"]) =>
  data.reduce<HomeCitiesProps["data"][]>((columns, city, index) => {
    if (index % 2 === 0) columns.push([city]);
    else columns[columns.length - 1]?.push(city);
    return columns;
  }, []);

const HomeCityFilterContainer = ({ data, title, devices }: HomeCitiesProps) => {
  const columns = splitIntoColumns(data);
  const isCompact = !!devices?.isMobile || !!devices?.isTablet;

  return (
    <div className="home-tile-row noSelect relative flex w-full select-none flex-col gap-2.5 rounded-20 md:gap-2 lg:gap-3">
      <div className="padding-x hidden w-full items-center justify-between md:flex">
        <p className="shrink-0 text-start text-base font-bold lg:text-xl">
          {title}
        </p>
      </div>

      <Swiper
        viewportClassName="padding-x"
        slidesPerView={
          isCompact
            ? HOME_TILE_DEFAULT_SLIDES_PER_VIEW.compact
            : HOME_TILE_DEFAULT_SLIDES_PER_VIEW.wide
        }
        spaceBetween={
          isCompact
            ? HOME_TILE_DEFAULT_SPACE_BETWEEN.compact
            : HOME_TILE_DEFAULT_SPACE_BETWEEN.wide
        }
        breakPoints={HOME_TILE_BREAKPOINTS}
        options={{ align: "start", direction: "rtl", dragFree: true, loop: false }}
      >
        {columns.map((column, index) => (
          <SwiperSlide
            key={`city-column-${index}`}
            className="home-tile-slide cursor-pointer p-0 md:px-2 md:py-2"
          >
            <div className="flex flex-col gap-2.5 md:gap-2 lg:gap-3">
              {column.map((city, cityIndex) => (
                <HomeCityItem
                  item={city}
                  key={`${city.title}-${cityIndex}`}
                />
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeCityFilterContainer;
