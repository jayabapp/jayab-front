import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { type HomeLandingDto } from "@/types/components/modules/home";

import HomeTileCard from "./HomeTileCard";

const PROPERTY_TYPE_FALLBACK_ICON = "/assets/icons/logo/mobile_header_logo.svg";

const PropertyTypeItem = ({
  item,
  index,
  sizeClassName,
}: {
  index?: number;
  item: HomeLandingDto;
  sizeClassName?: string;
}) => (
  <HomeTileCard
    index={index}
    title={item?.title}
    sizeClassName={sizeClassName}
    href={`/rooms?property_type=${item?.id}`}
    imageSrc={
      item?.image ? getHomeImageUrl(item?.image) : PROPERTY_TYPE_FALLBACK_ICON
    }
  />
);

export default PropertyTypeItem;
