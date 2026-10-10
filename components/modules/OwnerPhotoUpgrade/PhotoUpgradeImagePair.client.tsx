"use client";

import { getUploadedImageUrl } from "@features/upload/mappers/upload-image.mapper";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { colors } from "@/theme/colors";

import type { PhotoUpgradeImagePairProps } from "@/types/components/modules/photo-upgrade";
import type { PhotoUpgradeImageBoxProps } from "@/types/components/modules/photo-upgrade";
import type { PhotoUpgradeImage } from "@/types/components/modules/photo-upgrade";
import type { PhotoUpgradeItem } from "@/types/components/modules/photo-upgrade";

import RemoteImageModal from "@features/photo-upgrade/components/RemoteImageModal";
import StatusShower from "@elements/StatusShower";
import Image from "next/image";
import Link from "next/link";

const getOldImage = (item: PhotoUpgradeItem): PhotoUpgradeImage | null =>
  item?.original_attachment ||
  item?.previous_attachment ||
  item?.attachment ||
  null;

const getNewImage = (item: PhotoUpgradeItem): PhotoUpgradeImage | null =>
  item?.current_attachment || item?.attachment || null;

const ImageBox = ({
  cb,
  title,
  image,
  emptyTitle: emptyTitleProp,
}: PhotoUpgradeImageBoxProps) => {
  const t = useTranslations();
  const emptyTitle = emptyTitleProp ?? t("owner.noPhoto");

  return (
    <div onClick={cb} className="flex min-w-0 cursor-pointer flex-col gap-2">
      {image ? (
        <div className="relative overflow-hidden rounded-10 border border-surface-muted bg-surface-muted">
          <Image
            width={640}
            height={480}
            alt={image?.alt || title}
            sizes="(max-width: 1024px) 50vw, 320px"
            src={getUploadedImageUrl(image, "medium")}
            className="aspect-[4/3] w-full object-cover"
          />
          <span className="absolute right-2 top-2 rounded-10 bg-black/55 px-2 py-1 text-2xs font-medium text-white backdrop-blur">
            {title}
          </span>

          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={getUploadedImageUrl(image, "medium") || ""}
            className="absolute left-2 bottom-2  bg-action/50 rounded-md   px-2 py-1 text-2xs font-medium text-white backdrop-blur "
          >
            {t("listing.download")}
          </Link>
        </div>
      ) : (
        <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-10 border border-dashed border-line-strong bg-surface-muted px-2 text-center text-2xs text-ink-subtle md:text-xs">
          <span className="absolute right-2 top-2 rounded-10 bg-surface px-2 py-1 text-2xs font-medium text-ink-subtle">
            {title}
          </span>
          {emptyTitle}
        </div>
      )}
    </div>
  );
};

const PhotoUpgradeImagePair = ({ item, index }: PhotoUpgradeImagePairProps) => {
  const t = useTranslations();

  const [image, selectedImage] = useState<PhotoUpgradeImage | null>(null);
  const oldImage = getOldImage(item);
  const newImage = getNewImage(item);
  const hasDistinctNewImage = !!newImage && newImage?.id !== oldImage?.id;

  return (
    <div className="property-card-shadow flex flex-col gap-3 rounded-20 bg-surface p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">
          {t("owner.photoNumber", { number: index + 1 })}
        </p>
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
          title={t("owner.photoBefore")}
          image={oldImage}
        />
        <ImageBox
          cb={() => {
            if (!hasDistinctNewImage) return;
            selectedImage(newImage);
          }}
          title={t("owner.photoAfter")}
          image={hasDistinctNewImage ? newImage : null}
          emptyTitle={t("owner.notReadyYet")}
        />
      </div>
      <RemoteImageModal
        show={!!image}
        src={
          getUploadedImageUrl(image) ||
          "/assets/icons/shared/image_placeholder.svg"
        }
        alt={image?.alt || t("owner.imageNumber", { number: index + 1 })}
        onHide={() => selectedImage(null)}
      />
    </div>
  );
};

export default PhotoUpgradeImagePair;
