import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
import React from "react";
import { HomeLandingDto } from "@/api_services/home/home.interface";
import Link from "next/link";

const CategoryItem = ({ item }: { item: HomeLandingDto }) => {
  return (
    <Link
      href={item?.url}
      id={item?.title}
      prefetch={false}
      // data-umami-event-id={item?.title}
      // data-umami-event={"Category Select"}
      // onClick={() => {
      //   if (!!item?.title) {
      //     onSuggClick(item?.url);
      //   }
      // }}
      className="flex flex-col gap-2 items-center p-2 w-full group  select-none transition-all duration-500 "
    >
      <div id={`${item?.title || "fake"}CatImage`} className="w-full relative rounded-10  aspect-[0.85] z-30">
        {" "}
        <Image
          // src={imageError ? DefaultIcon : IMAGE_URL(data?.cover_location)}
          src={item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/shared/image_placeholder.svg"}
          alt={`icatImages${item?.title}`}
          fill
          className={`mix-blend-multiply z-2  rounded-10 dark:mix-blend-normal    w-full transition-all duration-500 aspect-[0.85]  ${
            !!item?.image ? "!object-cover" : "!object-contain opacity-50 bg-primary-200  md:px-8"
          }

   
          `}
        />
      </div>

      <h2 className={` opacity-80 text-xs text-center  line-clamp-2 h-8 md:h-12 md:text-base `}>{item?.title}</h2>
    </Link>
  );
};

export default CategoryItem;
