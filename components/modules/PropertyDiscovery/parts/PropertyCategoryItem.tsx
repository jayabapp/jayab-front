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
    className={`flex justify-center rounded-2xl border w-full aspect-square flex-col items-center gap-2 ${
      isSelected ? "border-brand-600" : ""
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
