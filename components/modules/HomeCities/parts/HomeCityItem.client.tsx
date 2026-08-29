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
      onClick={onClickCB}
      href={item?.url}
      prefetch={false}
      id={item?.title}
      title={item?.title}
      // data-umami-event-id={item?.title}
      // data-umami-event={"Category Select"}

      className="flex flex-col overflow-clip  rounded-10  aspect-square relative items-center  w-full group  select-none transition-all duration-500 "
    >
      <div id={`${item?.title || "fake"}CatImage`} className="w-full  col-span-2  relative rounded-10  aspect-square ">
        {" "}
        <Image
          // Without `sizes`, a `fill` image is treated as 100vw and next/image
          // builds its srcset from deviceSizes alone (smallest 640), so a 412px
          // viewport downloaded w=750 for a thumbnail that renders at 84px.
          // Declaring `sizes` also brings imageSizes (16-384) into the srcset.
          // Widths come from the carousel: 4.25 slides below 1024px and 8 above,
          // inside a `padding-x` viewport, i.e. ~20vw then ~11vw. Rounded up so
          // the candidate is never smaller than the slot at any DPR.
          sizes="(min-width: 1024px) 12vw, 21vw"
          // src={imageError ? DefaultIcon : IMAGE_URL(data?.cover_location)}
          src={item?.image ? getHomeImageUrl(item?.image) : "/assets/icons/shared/image_placeholder.svg"}
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
