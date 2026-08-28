import { HomeLandingDto } from "@/api_services/home/home.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
import Link from "next/link";

const CategoryItem = ({ item }: { item: HomeLandingDto }) => {
  return (
    <Link
      href={item?.url}
      title={item?.title}
      id={item?.title}
      prefetch={false}
      // data-umami-event-id={item?.title}
      // data-umami-event={"Category Select"}
      // onClick={() => {
      //   if (!!item?.title) {
      //     onSuggClick(item?.url);
      //   }
      // }}
      className="flex  justify-center   rounded-2xl  border   aspect-square  flex-col   items-center gap-2 "
    >
      <div
        id={`${item?.title || "fake"}CatImage`}
        className=" relative rounded-sm   size-8 md:size-16  aspect-square z-30"
      >
        {" "}
        <Image
          // Same `fill`-without-`sizes` problem as HomeCityItem. This icon is a
          // fixed size in CSS - `size-8` (32px) below md, `size-16` (64px) at md
          // and above - so the widths are exact rather than viewport-relative.
          sizes="(min-width: 768px) 64px, 32px"
          // src={imageError ? DefaultIcon : IMAGE_URL(data?.cover_location)}
          src={item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/shared/image_placeholder.svg"}
          alt={`icatImages${item?.title}`}
          fill
          className={`mix-blend-multiply z-2  rounded-sm     size-7 md:size-16 transition-all duration-500 aspect-square  ${
            !!item?.image ? "!object-cover" : "!object-contain opacity-50 bg-neutral-200  md:px-8"
          }

   
          `}
        />
      </div>

      <h2
        className={` opacity-80  text-sm font-medium md:font-bold text-center  line-clamp-1 h-5 !text-black md:h-8  md:text-base `}
      >
        {item?.title}
      </h2>
    </Link>
  );
};

export default CategoryItem;
