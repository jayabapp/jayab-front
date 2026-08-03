import { NEW_IMAGE_URL } from "@/utils/urls";

import Image from "next/image";

type ProductImageType = {
  item: any;
  sizes?: string;
  moreClass: string;
  id: string | null;
  alt?: string | null;
  onClick: () => void | null;
  imageSize?: "name" | "thumbnail" | "medium" | undefined;
};

const INTRINSIC = 320;

function ProductImage({
  alt,
  item,
  onClick,
  moreClass,
  id = null,
  imageSize,
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
