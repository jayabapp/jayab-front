import { type HomeLandingDto } from "@/types/components/modules/home";
import { landingStaticIcon } from "@features/properties/lib/static-icons";

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
    imageSrc={QUICK_SEARCH_FALLBACK_ICON}
    icon={landingStaticIcon(item?.url ?? "")}
  />
);

export default QuickSearchItem;
