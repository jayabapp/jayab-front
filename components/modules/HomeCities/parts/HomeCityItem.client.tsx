"use client";

import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { type HomeLandingDto } from "@/types/components/modules/home";
import { useCitiesStore } from "@/store";

import Image from "next/image";
import Link from "next/link";

const HomeCityItem = ({ item }: { item: HomeLandingDto }) => {
  const onClickCB = () => {
    useCitiesStore.setState({
      locationsData: {},
    });
  };

  return (
    <Link
      href={item?.url}
      // Deliberately opted out, unlike the other content links. These rows are a
      // marquee: every card is rendered twice and both copies drift through the
      // viewport continuously, so viewport prefetching would re-fire for the
      // whole city list on a loop rather than once.
      prefetch={false}
      id={item?.title}
      onClick={onClickCB}
      title={item?.title}
      className="flex flex-col overflow-clip  rounded-10  aspect-square relative items-center  w-full group  select-none transition-all duration-500 "
    >
      <div
        id={`${item?.title || "fake"}CatImage`}
        className="w-full  col-span-2  relative rounded-10  aspect-square "
      >
        {" "}
        <Image
          fill
          sizes="(min-width: 1024px) 12vw, 21vw"
          src={
            item?.image
              ? getHomeImageUrl(item?.image)
              : "/assets/icons/shared/image_placeholder.svg"
          }
          alt={`icatImages${item?.title}`}
          className={`rounded-10 w-full transition-all duration-500 aspect-square !object-cover`}
        />
      </div>

      <div className="absolute left-0 bottom-0 flex items-center  justify-start  py-1.5  pr-1.5  lg:pr-2.5 w-full ">
        <h2
          className={`col-span-3 !text-white w-fit text-start text-xs  md:text-base`}
        >
          {item?.title}
        </h2>
      </div>
    </Link>
  );
};

export default HomeCityItem;
