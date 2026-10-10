import { getPropertyTypeImageUrl } from "@features/properties/mappers/property-image.mapper";
import { ContentImage } from "@elements/Image";

import type { PropertyCategoryItemProps } from "@/types/components/modules/property-discovery";

const PropertyCategoryItem = ({
  cb,
  item,
  isSelected,
}: PropertyCategoryItemProps) => (
  <button
    id={item?.title}
    type="button"
    onClick={() => cb?.()}
    data-umami-event="Category Select"
    data-umami-event-id={item?.title}
    className={`flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border transition-colors ${
      isSelected
        ? "border-action bg-selected text-link"
        : "border-surface-muted bg-surface hover:border-line-strong"
    }`}
  >
    <ContentImage
      width={64}
      height={64}
      alt={item?.title || ""}
      sizes="(min-width: 768px) 64px, 32px"
      className="size-8 md:size-16 rounded-sm"
      src={getPropertyTypeImageUrl(item?.image)}
    />
    <p className="text-sm line-clamp-1 md:text-base font-normal md:font-bold">
      {item?.title}
    </p>
  </button>
);

export default PropertyCategoryItem;
