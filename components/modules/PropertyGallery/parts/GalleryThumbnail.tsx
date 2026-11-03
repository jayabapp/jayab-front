import type { GalleryThumbnailProps } from "@/types/components/modules/property-gallery";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { ContentImage } from "@elements/Image";

const INTRINSIC_SIZE = 320;

const GalleryThumbnail = ({
  id,
  alt,
  item,
  onClick,
  imageSize,
  moreClass = "",
  sizes = "(min-width: 768px) 20vw, 25vw",
}: GalleryThumbnailProps) => (
  <ContentImage
    sizes={sizes}
    loading="lazy"
    alt={alt || ""}
    title={alt || ""}
    onClick={onClick}
    width={INTRINSIC_SIZE}
    height={INTRINSIC_SIZE}
    id={id ? `${id}` : undefined}
    src={getPropertyImageUrl(item, imageSize)}
    fallbackSrc={
      imageSize && imageSize !== "name"
        ? getPropertyImageUrl(item, "name")
        : undefined
    }
    className={`cursor-pointer ${moreClass}`}
  />
);

export default GalleryThumbnail;
