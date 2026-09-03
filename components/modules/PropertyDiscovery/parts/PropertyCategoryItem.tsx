import type { PropertyCategoryItemProps } from "@/types/components/modules/property-discovery";
import { getPropertyTypeImageUrl } from "@features/properties/mappers/property-image.mapper";
import { ContentImage } from "@elements/Image";

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
    // White by default for the same reason the cards are: a tile with no
    // background is a tinted tile on this canvas, not a neutral one.
    className={`flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border transition-colors ${
      isSelected
        ? "border-brand-600 bg-brand-100 text-brand-700"
        : "border-neutral-100 bg-white hover:border-neutral-300"
    }`}
  >
    <ContentImage
      width={64}
      height={64}
      sizes="(min-width: 768px) 64px, 32px"
      alt={item?.title || ""}
      className="size-8 md:size-16 rounded-sm"
      src={getPropertyTypeImageUrl(item?.image)}
    />
    <p className="text-sm line-clamp-1 md:text-base font-normal md:font-bold">
      {item?.title}
    </p>
  </button>
);

export default PropertyCategoryItem;
