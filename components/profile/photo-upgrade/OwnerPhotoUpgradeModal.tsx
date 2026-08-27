"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { usePhotoUpgradeCheckout } from "@features/photo-upgrade/hooks/usePhotoUpgradeCheckout";
import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertySubsDto } from "@/api_services/property/property.interface";
import { PropertyListDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { ImageDto } from "@/api_services/auth/auth.interface";

import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import numberWithCommas from "@/helpers/numberWithCommas";
import useCmsContent from "@/hooks/useCmsContent";
import SwiperSlide from "@/components/embelaCarousel/SwiperSlide";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@/components/shared/CmsText";
import isEmpty from "lodash/isEmpty";
import Swiper from "@/components/embelaCarousel/Swiper";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import chunk from "lodash/chunk";
import Image from "next/image";

type TSelectTableImageProps = {
  image: ImageDto;
  isSelected: boolean;
  onToggle: (imageId: number) => void;
};

const SelectableImageItem = memo(
  ({ image, isSelected, onToggle }: TSelectTableImageProps) => {
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
        <Image
          src={
            NEW_IMAGE_URL(image, "medium") ||
            "/assets/icons/shared/image_placeholder.svg"
          }
          alt={image?.alt || "تصویر اقامتگاه"}
          fill
          sizes="(max-width: 768px) 25vw, 160px"
          className="object-cover"
        />
        <span
          className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-md border text-xs font-bold ${
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

type TOwnerPhotoUpgradeProps = {
  property: PropertyListDto | SingleOwnerPropertyDto | null;
  onHide: () => void;
  noImageSubmit?: () => void;
  onHideClick?: () => void;
  extraPrice?: number;
  mutationOptions?: {
    promote_id?: number;
    redirect_url?: string;
    subscription_id?: number;
  };
  selectedPlans?: PropertySubsDto[];
};

const OwnerPhotoUpgradeModal = ({
  onHide,
  property,
  extraPrice,
  onHideClick,
  noImageSubmit,
  selectedPlans,
  mutationOptions,
}: TOwnerPhotoUpgradeProps) => {
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);

  const {
    settings,
    property: propertyDetails,
    isPropertyPending: isLoading,
    checkout,
  } = usePhotoUpgradeCheckout(property?.id);

  const PHOTO_UPGRADE_PRICE = Number(settings?.photo_upgrade_price);

  const images = useMemo(() => {
    const propertyImages = propertyDetails?.images || [];
    if (!isEmpty(propertyImages)) return propertyImages;
    return propertyDetails?.feature_image
      ? [propertyDetails.feature_image]
      : [];
  }, [propertyDetails]);

  const totalAmount = selectedImageIds.length * PHOTO_UPGRADE_PRICE;

  const { mutate, isPending } = checkout;

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
      gateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "",
      redirect_url:
        mutationOptions?.redirect_url ??
        `${window.origin}/profile/owner/photo-upgrade-requests`,
      property_id: property.id,
      photo_upgrade_enabled: true,
      photo_upgrade_property_id: property.id,
      photo_upgrade_image_ids: selectedImageIds,
      promote_id: mutationOptions?.promote_id || undefined,
      subscription_id: mutationOptions?.subscription_id || undefined,
    });
  };

  const { content: upgradeContent, isLoading: contentLoading } = useCmsContent(
    "upgrade-image-content",
    { enabled: !!property },
  );

  const chunckedImages = chunk(images, 8)?.map((e) => chunk(e, 4));

  return (
    <ModalBottomSheet
      show={!!property}
      onHide={onHide}
      options={{ containerClass: " !max-h-[99dvh] md:!max-h-[85dvh] " }}
    >
      <div className="flex flex-col gap-4 p-3 pt-0">
        <div className="flex items-center sticky top-0 bg-white py-2 justify-center gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-base text-center font-bold text-primary-700">
                سرویس بهبود تصویر
              </p>
              <div className="new-tag   rotate-[-9deg] text-xs font-bold  text-white rounded-lg  h-6 w-11 flex items-center justify-center ">
                {_STRINGS.NEW}
              </div>
            </div>
            <p className="mt-1 line-clamp-1 text-center text-xs text-gray-500">
              {property?.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onHide}
            className="flex h-9 absolute left-0  top-2  w-9 shrink-0 items-center justify-center rounded-full bg-gray-100"
          >
            <Image
              width={16}
              alt="بستن"
              height={16}
              className="h-4 w-4"
              src="/assets/icons/shared/close.svg"
            />
          </button>
        </div>
        {!!contentLoading ? (
          <div className="h-36 w-full animate-pulse rounded-10 bg-neutral-100" />
        ) : !!upgradeContent ? (
          <div className="w-full flex flex-col items-center justify-center gap-4 ">
            {!!upgradeContent?.feature_image ? (
              <Image
                src={
                  NEW_IMAGE_URL(upgradeContent?.feature_image, "medium") ||
                  "/assets/icons/shared/image_placeholder.svg"
                }
                alt="نمونه بهبود تصویر"
                width={600}
                height={150}
                sizes="(max-width: 768px) 90vw, 600px"
                className="h-auto max-h-[150px] w-auto object-contain"
              />
            ) : (
              <></>
            )}
            <div className="w-full items-center justify-center flex flex-col gap-1">
              <CmsText className="text-base font-medium text-center">
                {upgradeContent?.small_text}
              </CmsText>
              <CmsText className="text-sm   text-center ">
                {upgradeContent?.full_text}
              </CmsText>
            </div>
          </div>
        ) : (
          <></>
        )}

        {isLoading ? (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-10 bg-neutral-100"
              />
            ))}
          </div>
        ) : isEmpty(images) ? (
          <div className="rounded-10 border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            تصویری برای این آگهی ثبت نشده است.
          </div>
        ) : (
          <Swiper
            breakPoints={{
              320: {
                slidesPerView: 0.9,
                spaceBetween: 4,
              },
              640: {
                slidesPerView: 0.9,
                spaceBetween: 4,
              },
              768: {
                slidesPerView: 1.5,
                spaceBetween: 4,
              },
              1024: {
                slidesPerView: 1.5,
                spaceBetween: 4,
              },
              1600: {
                slidesPerView: 1.5,
                spaceBetween: 4,
              },
            }}
          >
            {chunckedImages?.map((e, index) => (
              <SwiperSlide
                key={`${index}swiper`}
                className="flex  flex-col gap-1 "
              >
                {e.map((chunk, index) => (
                  <>
                    <div
                      key={`group${index}`}
                      className=" w-full  grid grid-cols-4 gap-1"
                    >
                      {chunk?.map((image) => (
                        <SelectableImageItem
                          image={image}
                          onToggle={toggleImage}
                          key={`photoUpgradeSelectableImage${image.id}`}
                          isSelected={selectedImageIds.includes(image.id)}
                        />
                      ))}
                    </div>
                  </>
                ))}
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {!!upgradeContent?.html ? (
          <p className="text-primary-700  w-full text-sm text-center ">
            تصاویر بهینه شده بعد از 24 ساعت جایگزین میشوند
          </p>
        ) : (
          <></>
        )}

        <div className="flex flex-col gap-2 rounded-10 border border-gray-100 p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-500">تعداد تصاویر</span>
            <span className="font-medium">{selectedImageIds.length} عکس</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-500">هزینه بهبود هر تصویر</span>
            <span className="font-medium">
              {numberWithCommas(PHOTO_UPGRADE_PRICE)} تومان
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 border-t pt-2 text-primary-700">
            <span className="font-medium">هزینه نهایی بهبود تصویر</span>
            <span className="font-bold">
              {numberWithCommas(totalAmount)} تومان
            </span>
          </div>
          {!isEmpty(selectedPlans) ? (
            selectedPlans?.map((e) => (
              <div
                key={`slectedPlan${e?.id}`}
                className="flex items-center justify-between gap-2 border-t pt-2 text-primary-700"
              >
                <span className="font-medium">{e?.title}</span>
                <span className="font-bold">
                  {numberWithCommas(e?.price_with_discount || e?.price)} تومان
                </span>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>

        <div className="w-full grid  sticky bottom-0 grid-cols-3 items-center gap-2 ">
          <Button
            loading={isPending}
            disabled={
              (isEmpty(selectedImageIds) || isLoading || !totalAmount) &&
              !extraPrice
            }
            onClick={
              !!extraPrice && !totalAmount && !!noImageSubmit
                ? noImageSubmit
                : onSubmit
            }
            width="w-full"
            containerClass={`${extraPrice ? "col-span-3" : "col-span-2"}  `}
            title={`پرداخت ${totalAmount || !!extraPrice ? `${numberWithCommas(totalAmount + Number(extraPrice || 0))} ${_STRINGS.TOMAN}` : ""} `}
          />
          {!!extraPrice ? (
            <></>
          ) : (
            <Button
              color="danger"
              containerClass={` `}
              title={_STRINGS.NOW_NOW}
              width="w-full !text-white "
              onClick={onHideClick ?? onHide}
            />
          )}
        </div>
      </div>
    </ModalBottomSheet>
  );
};

export default OwnerPhotoUpgradeModal;
