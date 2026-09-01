"use client";

import { colors } from "@/theme/colors";

import { PhotoUpgradeRequestItemDto } from "@/api_services/photo-upgrade/photo-upgrade.interface";
import StatusShower from "@elements/StatusShower";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { ImageDto } from "@/api_services/auth/auth.interface";
import { useState } from "react";

import type { PhotoUpgradeImageBoxProps, PhotoUpgradeImagePairProps } from "@/types/components/modules/photo-upgrade";

import RemoteImageModal from "@features/photo-upgrade/components/RemoteImageModal";
import Image from "next/image";
import Link from "next/link";

const getOldImage = (item: PhotoUpgradeRequestItemDto): ImageDto | null =>
  item?.original_attachment ||
  item?.previous_attachment ||
  item?.attachment ||
  null;

const getNewImage = (item: PhotoUpgradeRequestItemDto): ImageDto | null =>
  item?.current_attachment || item?.attachment || null;

const ImageBox = ({
  cb,
  title,
  image,
  emptyTitle = "عکسی ثبت نشده",
}: PhotoUpgradeImageBoxProps) => (
  <div onClick={cb} className="flex min-w-0 flex-col gap-2">
    {image ? (
      <div className="relative overflow-hidden rounded-10 border border-neutral-100 bg-neutral-50">
        <Image
          width={640}
          height={480}
          alt={image?.alt || title}
          src={NEW_IMAGE_URL(image, "medium")}
          sizes="(max-width: 1024px) 50vw, 320px"
          className="aspect-[4/3] w-full object-cover"
        />
        <span className="absolute right-2 top-2 rounded-10 bg-black/55 px-2 py-1 text-xxs font-medium text-white backdrop-blur">
          {title}
        </span>

        <Link
          onClick={(e) => {
            e.stopPropagation();
          }}
          href={NEW_IMAGE_URL(image, "medium") || ""}
          className="absolute left-2 bottom-2  bg-brand-600/50 rounded-md   px-2 py-1 text-xxs font-medium text-white backdrop-blur "
        >
          دانلود
        </Link>
      </div>
    ) : (
      <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-10 border border-dashed border-neutral-300 bg-neutral-50 px-2 text-center text-xxs text-neutral-400 md:text-xs">
        <span className="absolute right-2 top-2 rounded-10 bg-white px-2 py-1 text-xxs font-medium text-neutral-500">
          {title}
        </span>
        {emptyTitle}
      </div>
    )}
  </div>
);

const PhotoUpgradeImagePair = ({ item, index }: PhotoUpgradeImagePairProps) => {
  const [image, selectedImage] = useState<ImageDto | null>(null);
  const oldImage = getOldImage(item);
  const newImage = getNewImage(item);
  const hasDistinctNewImage = !!newImage && newImage?.id !== oldImage?.id;

  return (
    <div className="property-card-shadow flex flex-col gap-3 rounded-20 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">عکس {index + 1}</p>
        {item?.status_title ? (
          <StatusShower
            data={{
              id: item.status,
              title: item.status_title,
              hex: item.is_edited ? colors.success[500] : colors.brand[500],
            }}
            containerClass="!px-2 !py-1"
          />
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <ImageBox
          cb={() => {
            selectedImage(oldImage);
          }}
          title="عکس قبلی"
          image={oldImage}
        />
        <ImageBox
          cb={() => {
            if (!hasDistinctNewImage) return;
            selectedImage(newImage);
          }}
          title="عکس جدید"
          image={hasDistinctNewImage ? newImage : null}
          emptyTitle="هنوز آماده نشده"
        />
      </div>
      <RemoteImageModal
        show={!!image}
        src={
          NEW_IMAGE_URL(image) || "/assets/icons/shared/image_placeholder.svg"
        }
        alt={image?.alt || `تصویر ${index + 1}`}
        onHide={() => selectedImage(null)}
      />
    </div>
  );
};

export default PhotoUpgradeImagePair;
