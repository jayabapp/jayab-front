import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { type HomeLandingDto } from "@/types/components/modules/home";
import { ContentImage } from "@/components/elements/Image";

import Link from "next/link";

const PropertyTypeItem = ({ item }: { item: HomeLandingDto }) => {
  return (
    <Link
      title={item?.title}
      href={`/rooms?property_type=${item?.id}`}
      className="flex  justify-center   rounded-2xl  border   aspect-square  flex-col   items-center gap-2"
    >
      <ContentImage
        width={64}
        height={64}
        alt={item?.title || ""}
        sizes="(min-width: 768px) 64px, 32px"
        className=" size-8 md:size-16  rounded-sm "
        src={
          item?.image
            ? getHomeImageUrl(item?.image)
            : "/assets/icons/logo/mobile_header_logo.svg"
        }
      />
      <p className=" text-sm line-clamp-1 md:text-base font-normal md:font-bold">
        {item?.title}
      </p>
    </Link>
  );
};

export default PropertyTypeItem;
