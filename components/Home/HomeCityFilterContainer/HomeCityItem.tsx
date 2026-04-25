"use client";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
import Link from "next/link";

import { HomeLandingDto } from "@/api_services/home/home.interface";
import { useCitiesStore } from "@/store";

const HomeCityItem = ({ item }: { item: HomeLandingDto }) => {
  const onClickCB = () => {
    useCitiesStore.setState({
      locationsData: {},
    });
  };

  return (
    <Link
      onClick={onClickCB}
      href={item?.url}
      prefetch={false}
      id={item?.title}
      // data-umami-event-id={item?.title}
      // data-umami-event={"Category Select"}

      className="flex flex-col overflow-clip  rounded-10  aspect-square relative items-center  w-full group  select-none transition-all duration-500 "
    >
      <div id={`${item?.title || "fake"}CatImage`} className="w-full  col-span-2  relative rounded-10  aspect-square ">
        {" "}
        <Image
          loading="eager"
          // src={imageError ? DefaultIcon : IMAGE_URL(data?.cover_location)}
          src={item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/shared/image_placeholder.svg"}
          alt={`icatImages${item?.title}`}
          fill
          className={` rounded-10     w-full transition-all duration-500 aspect-square !object-cover

   
          `}
        />
      </div>

      <div className="absolute left-0 bottom-0 flex items-center  justify-start  py-1.5  pr-1.5  lg:pr-2.5 w-full ">
        <h2 className={`  col-span-3 !text-white w-fit text-start text-xs  md:text-base`}>{item?.title}</h2>
      </div>
    </Link>
  );
};

export default HomeCityItem;
