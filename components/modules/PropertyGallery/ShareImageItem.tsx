import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { ContentImage } from "@elements/Image";

import type { ShareImageItemProps } from "@/types/components/modules/property-gallery";

const ShareImageItem = ({ cb, image, isSelected }: ShareImageItemProps) => (
  <button
    type="button"
    onClick={cb}
    aria-pressed={isSelected}
    className={`w-full aspect-square relative border-4 rounded-2xl overflow-hidden cursor-pointer ${
      isSelected ? "border-action" : ""
    }`}
  >
    <ContentImage
      fill
      alt={image?.alt || ""}
      src={getPropertyImageUrl(image)}
      sizes="(min-width: 768px) 10vw, 22vw"
      className="w-full object-cover aspect-square"
    />
  </button>
);

export default ShareImageItem;
