import { NEW_IMAGE_URL } from "@/utils/urls";

import Image from "next/image";

type ProductImageType = {
  item: any;
  moreClass: string;
  imageSize?: "name" | "thumbnail" | "medium" | undefined;
  onClick: () => void | null;
  id: string | null;
  alt?: string | null;
  /** Rendered-width hint for srcset selection. Defaults to the gallery thumbnail column. */
  sizes?: string;
};

const INTRINSIC = 320;

function ProductImage({
  item,
  moreClass,
  onClick,
  id = null,
  imageSize,
  alt,
  sizes = "(min-width: 768px) 20vw, 25vw",
}: ProductImageType) {
  return (
    <>
      <Image
        sizes={sizes}
        loading="lazy"
        alt={alt || ""}
        title={alt || ""}
        width={INTRINSIC}
        onClick={onClick}
        height={INTRINSIC}
        id={id ? `${id}` : "15"}
        src={NEW_IMAGE_URL(item, imageSize)}
        className={`cursor-pointer ${moreClass}`}
      />
    </>
  );
}

export default ProductImage;
