import { NEW_IMAGE_URL } from "@/utils/urls";
import React from "react";

type ProductImageType = {
  item: any;
  moreClass: string;
  onClick: () => void | null;
  id: string | null;
};

function ProductImage({ item, moreClass, onClick, id = null }: ProductImageType) {
  return (
    <>
      <img
        id={id ? `${id}` : "15"}
        src={item}
        // src={NEW_IMAGE_URL(item)}
        className={`cursor-pointer ${moreClass}`}
        onClick={onClick}
      />
    </>
  );
}

export default ProductImage;
