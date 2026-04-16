import { HomeLandingDto } from "@/api_services/home/home.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
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
      className="flex flex-col  lg:gap-4 aspect-square justify-between  lg:justify-center items-center p-2 w-full group border rounded-2xl select-none transition-all duration-500 "
    >
      <div id={`${item?.title || "fake"}CatImage`} className=" relative rounded-sm    w-10 h-10  aspect-square z-30">
        {" "}
        <Image
          loading="eager"
          // src={imageError ? DefaultIcon : IMAGE_URL(data?.cover_location)}
          src={item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/shared/image_placeholder.svg"}
          alt={`icatImages${item?.title}`}
          fill
          className={`mix-blend-multiply z-2  rounded-sm dark:mix-blend-normal    w-10 h-10 transition-all duration-500 aspect-square  ${
            !!item?.image ? "!object-cover" : "!object-contain opacity-50 bg-primary-200  md:px-8"
          }

   
          `}
        />
      </div>

      <h2
        className={` opacity-80  text-xs lg:text-lg font-medium lg:font-bold text-center  line-clamp-1 h-5 !text-black md:h-8  md:text-base `}
      >
        {item?.title}
      </h2>
    </Link>
  );
};

export default CategoryItem;
