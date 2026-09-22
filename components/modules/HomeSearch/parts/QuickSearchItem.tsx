import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";

import type { TQuickSearchItem } from "@/types/components/modules/home";

import HomeTileCard from "./HomeTileCard";

const QUICK_SEARCH_FALLBACK_ICON = "/assets/icons/shared/image_placeholder.svg";

const QuickSearchItem = ({ item, index, sizeClassName }: TQuickSearchItem) => (
  <HomeTileCard
    index={index}
    href={item?.url}
    title={item?.title}
    sizeClassName={sizeClassName}
    imageSrc={
      item?.image ? getHomeImageUrl(item?.image) : QUICK_SEARCH_FALLBACK_ICON
    }
  />
);

export default QuickSearchItem;
