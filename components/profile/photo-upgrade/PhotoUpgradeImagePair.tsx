"use client";

import { PhotoUpgradeRequestItemDto } from "@/api_services/photo-upgrade/photo-upgrade.interface";
import StatusShower from "@/components/shared/StatusShower";
import { ImageDto } from "@/api_services/auth/auth.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";

const getOldImage = (item: PhotoUpgradeRequestItemDto): ImageDto | null =>
  item?.original_attachment ||
  item?.old_attachment ||
  item?.previous_attachment ||
  item?.attachment ||
  item?.image ||
  null;

const getNewImage = (item: PhotoUpgradeRequestItemDto): ImageDto | null =>
  item?.optimized_attachment ||
  item?.new_attachment ||
  item?.attachment ||
  item?.image ||
  null;

const ImageBox = ({
  title,
  image,
  emptyTitle = "عکسی ثبت نشده",
}: {
  title: string;
  image?: ImageDto | null;
  emptyTitle?: string;
}) => (
  <div className="flex min-w-0 flex-col gap-2">
    {image ? (
      <div className="relative overflow-hidden rounded-10 border border-gray-100 bg-gray-50">
        <img
          src={NEW_IMAGE_URL(image, "medium")}
          alt={image?.alt || title}
          className="aspect-[4/3] w-full object-cover"
        />
        <span className="absolute right-2 top-2 rounded-10 bg-black/55 px-2 py-1 text-xxs font-medium text-white backdrop-blur">
          {title}
        </span>
      </div>
    ) : (
      <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-10 border border-dashed border-gray-300 bg-gray-50 px-2 text-center text-xxs text-gray-400 md:text-xs">
        <span className="absolute right-2 top-2 rounded-10 bg-white px-2 py-1 text-xxs font-medium text-gray-500">
          {title}
        </span>
        {emptyTitle}
      </div>
    )}
  </div>
);

const PhotoUpgradeImagePair = ({
  item,
  index,
}: {
  item: PhotoUpgradeRequestItemDto;
  index: number;
}) => {
  const oldImage = getOldImage(item);
  const newImage = getNewImage(item);
  const hasDistinctNewImage = !!newImage && newImage?.id !== oldImage?.id;

  return (
    <div className="property-card-shadow flex flex-col gap-3 rounded-20 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">عکس {index + 1}</p>
        {item?.status ? (
          <StatusShower data={item.status} containerClass="!px-2 !py-1" />
        ) : (
          <></>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <ImageBox title="عکس قبلی" image={oldImage} />
        <ImageBox
          title="عکس جدید"
          image={hasDistinctNewImage ? newImage : null}
          emptyTitle="هنوز آماده نشده"
        />
      </div>
    </div>
  );
};

export default PhotoUpgradeImagePair;
