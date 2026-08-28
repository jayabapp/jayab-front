import { ImageDto } from "@/api_services/auth/auth.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
import React from "react";

const ShareImageItems = ({
  image,
  isSelected,
  cb,
}: {
  image: ImageDto;
  isSelected: boolean;
  cb: () => void | null;
}) => {
  return (
    <div
      onClick={cb}
      className={`w-full  aspect-square relative   border-4 rounded-2xl  overflow-hidden cursor-pointer  ${
        isSelected ? " border-brand-600" : ""
      } `}
    >
      <Image
        fill
        sizes="(min-width: 768px) 10vw, 22vw"
        alt={image?.alt || ""}
        className="  w-full object-cover aspect-square"
        src={NEW_IMAGE_URL(image)}
      />
    </div>
  );
};

export default ShareImageItems;
