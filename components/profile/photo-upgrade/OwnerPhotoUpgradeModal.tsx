"use client";

import { ImageDto } from "@/api_services/auth/auth.interface";
import { PropertyListDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Notify from "@/components/shared/Toast";
import numberWithCommas from "@/helpers/numberWithCommas";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMutation, useQuery } from "@tanstack/react-query";
import isEmpty from "lodash/isEmpty";
import { memo, useCallback, useMemo, useState } from "react";

const PHOTO_UPGRADE_PRICE = 50000;

const SelectableImageItem = memo(
  ({
    image,
    isSelected,
    onToggle,
  }: {
    image: ImageDto;
    isSelected: boolean;
    onToggle: (imageId: number) => void;
  }) => {
    return (
      <button
        type="button"
        onClick={() => onToggle(image.id)}
        className={`relative aspect-square overflow-hidden rounded-10 border transition-all ${
          isSelected
            ? "border-primary-700 ring-2 ring-primary-700/30"
            : "border-gray-200"
        }`}
      >
        <img
          src={NEW_IMAGE_URL(image)}
          alt={image?.alt || ""}
          className="h-full w-full object-cover"
        />
        <span
          className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md border text-sm font-bold ${
            isSelected
              ? "border-primary-700 bg-primary-700 text-white"
              : "border-white bg-black/40 text-white"
          }`}
        >
          {isSelected ? "✓" : ""}
        </span>
      </button>
    );
  },
);

SelectableImageItem.displayName = "SelectableImageItem";

const OwnerPhotoUpgradeModal = ({
  property,
  onHide,
}: {
  property: PropertyListDto | null;
  onHide: () => void;
}) => {
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: [
      PropertyService.OWNER_PROPERTIES_CACHEKEY,
      "photo-upgrade",
      property?.id,
    ],
    queryFn: () => {
      if (property?.id) {
        return PropertyService.GetSingleOwnerProperty({
          property_id: property.id,
        });
      }
      return null;
    },
    enabled: !!property?.id,
  });

  const images = useMemo(() => {
    const propertyImages = data?.images || [];
    if (!isEmpty(propertyImages)) return propertyImages;
    return data?.feature_image ? [data.feature_image] : [];
  }, [data]);

  const totalAmount = selectedImageIds.length * PHOTO_UPGRADE_PRICE;

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.PayPropetySubscription,
    onSuccess: (link) => {
      if (link) {
        window.location.href = link;
      }
    },
  });

  const toggleImage = useCallback((imageId: number) => {
    setSelectedImageIds((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId],
    );
  }, []);

  const onSubmit = () => {
    if (!property?.id) return;
    if (isEmpty(selectedImageIds)) {
      Notify({ type: "warn", body: "لطفا حداقل یک تصویر را انتخاب کنید" });
      return;
    }

    mutate({
      // gateway: "ZARINPAL",//TODO
      gateway: "SANDBOX",
      redirect_url: `${window.origin}/profile/owner/photo-upgrade-requests`,
      property_id: property.id,
      photo_upgrade_enabled: true,
      photo_upgrade_property_id: property.id,
      photo_upgrade_image_ids: selectedImageIds,
    });
  };

  return (
    <Modal
      show={!!property}
      onHide={onHide}
      options={{
        parentClass: "justify-end md:justify-center",
        containerClass:
          "mx-auto w-full max-h-[92dvh] overflow-y-scroll rounded-t-20 bg-white dark:bg-zinc-900 md:w-1/2 md:max-w-[560px] md:rounded-20",
      }}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-bold text-primary-700">
              سرویس اصلاح تصویر
            </p>
            <p className="mt-1 line-clamp-1 text-xs text-gray-500">
              {property?.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onHide}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100"
          >
            <img
              src="/assets/icons/shared/close.svg"
              alt="بستن"
              className="h-4 w-4"
            />
          </button>
        </div>

        <div className="rounded-10 bg-primary-700/10 px-3 py-2 text-sm text-primary-700">
          هر بهینه سازی {numberWithCommas(PHOTO_UPGRADE_PRICE)} تومان است.
        </div>

        {isLoading ? (
          <div className="h-48">
            <LottieLoading />
          </div>
        ) : isEmpty(images) ? (
          <div className="rounded-10 border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            تصویری برای این آگهی ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((image) => (
              <SelectableImageItem
                image={image}
                isSelected={selectedImageIds.includes(image.id)}
                onToggle={toggleImage}
                key={`photoUpgradeSelectableImage${image.id}`}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 rounded-10 border border-gray-100 p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-500">تعداد تصاویر</span>
            <span className="font-medium">{selectedImageIds.length} عکس</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-500">قیمت اصلاح هر تصویر</span>
            <span className="font-medium">
              {numberWithCommas(PHOTO_UPGRADE_PRICE)} تومان
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 border-t pt-2 text-primary-700">
            <span className="font-medium">هزینه نهایی</span>
            <span className="font-bold">
              {numberWithCommas(totalAmount)} تومان
            </span>
          </div>
        </div>

        <Button
          loading={isPending}
          disabled={isEmpty(selectedImageIds) || isLoading}
          onClick={onSubmit}
          width="w-full"
          title="ثبت"
        />
      </div>
    </Modal>
  );
};

export default OwnerPhotoUpgradeModal;
