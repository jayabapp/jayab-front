import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
import Link from "next/link";

import { HomeLandingDto } from "@/api_services/home/home.interface";

const HomeCityItem = ({ item }: { item: HomeLandingDto }) => {
  console.log(item, "itemitem");
  return (
    <Link
      href={item?.url}
      prefetch={false}
      id={item?.title}
      // data-umami-event-id={item?.title}
      // data-umami-event={"Category Select"}

      className="grid gap-4 grid-cols-5 items-center  w-full group  select-none transition-all duration-500 "
    >
      <div
        id={`${item?.title || "fake"}CatImage`}
        className="w-full  col-span-2  relative rounded-20  aspect-square z-30"
      >
        {" "}
        <Image
          loading="eager"
          // src={imageError ? DefaultIcon : IMAGE_URL(data?.cover_location)}
          src={item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/shared/image_placeholder.svg"}
          alt={`icatImages${item?.title}`}
          fill
          className={`mix-blend-multiply z-2  rounded-20 dark:mix-blend-normal    w-full transition-all duration-500 aspect-square !object-cover

   
          `}
        />
      </div>

      <h2 className={` col-span-3 !text-black w-full text-start text-xs  md:text-base`}>{item?.title}</h2>
    </Link>
  );
};

export default HomeCityItem;
