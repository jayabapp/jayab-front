import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { type HomeLandingDto } from "@/types/components/modules/home";

import HomeTileCard from "./HomeTileCard";

const QUICK_SEARCH_FALLBACK_ICON = "/assets/icons/shared/image_placeholder.svg";

const QuickSearchItem = ({
  item,
  index,
}: {
  index?: number;
  item: HomeLandingDto;
}) => (
  <HomeTileCard
    index={index}
    href={item?.url}
    title={item?.title}
    imageSrc={
      item?.image ? getHomeImageUrl(item?.image) : QUICK_SEARCH_FALLBACK_ICON
    }
  />
);

export default QuickSearchItem;
