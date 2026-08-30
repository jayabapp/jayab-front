import type { ProvinceCardProps } from "@/types/components/modules/city-selector";
import { getCityImageUrl } from "@features/cities/mappers/city-image.mapper";

import { ContentImage } from "@elements/Image";

const PREVIEW_CITY_COUNT = 5;

const ProvinceCard = ({ callback, item }: ProvinceCardProps) => (
  <button
    type="button"
    onClick={callback}
    className="flex w-full cursor-pointer flex-row items-center justify-start gap-4 text-right"
  >
    <span className="relative block h-10 w-10 shrink-0 aspect-square rounded-md">
      <ContentImage
        fill
        sizes="40px"
        alt={item?.title}
        className="rounded-md"
        src={getCityImageUrl(item?.image)}
      />
    </span>
    <span className="flex flex-col gap-2 items-start justify-start">
      <span className="text-sm md:text-base font-medium">{item?.title}</span>
      <span className="flex opacity-75 flex-wrap gap-1">
        {item?.child?.slice(0, PREVIEW_CITY_COUNT)?.map((city, index) => (
          <span className="text-xs" key={`${item?.id}-${city?.id}`}>
            {index === 0 ? "" : "-"} {city?.title}
          </span>
        ))}
      </span>
    </span>
  </button>
);

export default ProvinceCard;
