import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import findTree from "@/helpers/FindTree";
import { HomeLandingDto } from "@/api_services/home/home.interface";

const CategoryItem = ({ item }: { item: HomeLandingDto }) => {
  const router = useRouter();

  const pusher = (link: string) => {
    router.push(link);
  };
  const onSuggClick = (path: string) => {
    let link = path;

    pusher(link);
  };
  return (
    <button
      id={item?.title}
      data-umami-event-id={item?.title}
      data-umami-event={"Category Select"}
      onClick={() => {
        if (!!item?.title) {
          onSuggClick(item?.url);
        }
      }}
      className="flex flex-col gap-4 items-center p-2 w-full group  select-none transition-all duration-500 "
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

      <p className={`font-medium opacity-80 text-sm text-center  line-clamp-2 h-10 md:text-sm`}>{item?.title}</p>
    </button>
  );
};

export default CategoryItem;
