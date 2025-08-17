import { NEW_IMAGE_URL } from "@/utils/urls";
import React from "react";

type ProductImageType = {
  item: any;
  moreClass: string;
  imageSize?: "name" | "thumbnail" | "medium" | undefined;
  onClick: () => void | null;
  id: string | null;
};

function ProductImage({ item, moreClass, onClick, id = null, imageSize }: ProductImageType) {
  return (
    <>
      <img
        id={id ? `${id}` : "15"}
        // src={item}
        loading="lazy"
        src={NEW_IMAGE_URL(item, imageSize)}
        className={`cursor-pointer ${moreClass}`}
        onClick={onClick}
      />
    </>
  );
}

export default ProductImage;
