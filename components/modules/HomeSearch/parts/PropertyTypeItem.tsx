import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";

import type { TPropertyType } from "@/types/components/modules/home";

import HomeTileCard from "./HomeTileCard";

const PROPERTY_TYPE_FALLBACK_ICON = "/assets/icons/logo/mark.svg";

const PropertyTypeItem = ({ item, index }: TPropertyType) => (
  <HomeTileCard
    index={index}
    title={item?.title}
    href={`/rooms?property_type=${item?.id}`}
    imageSrc={
      item?.image ? getHomeImageUrl(item?.image) : PROPERTY_TYPE_FALLBACK_ICON
    }
  />
);

export default PropertyTypeItem;
