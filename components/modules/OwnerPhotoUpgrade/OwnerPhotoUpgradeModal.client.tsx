"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { usePhotoUpgradeCheckout } from "@features/photo-upgrade/hooks/usePhotoUpgradeCheckout";
import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { getUploadedImageUrl } from "@features/upload/mappers/upload-image.mapper";
import { ModalBottomSheet } from "@elements/Modal";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";

import type { SelectablePhotoUpgradeImageProps } from "@/types/components/modules/photo-upgrade";
import type { OwnerPhotoUpgradeModalProps } from "@/types/components/modules/photo-upgrade";

import SwiperSlide from "@elements/Carousel/SwiperSlide";
import Swiper from "@elements/Carousel/Swiper.client";
import useCmsContent from "@/hooks/useCmsContent";
import CmsText from "@elements/CmsText";
import Button from "@elements/Button";
import Notify from "@elements/Toast";
import isEmpty from "lodash/isEmpty";
import chunk from "lodash/chunk";
import Image from "next/image";

const SelectableImageItem = memo(
  ({ image, isSelected, onToggle }: SelectablePhotoUpgradeImageProps) => {
    const t = useTranslations();
    return (
      <button
        type="button"
        onClick={() => onToggle(image.id)}
        className={`relative aspect-square overflow-hidden rounded-10 border transition-all ${
          isSelected
            ? "border-brand-600 ring-2 ring-brand-600/30"
            : "border-neutral-200"
        }`}
      >
        <Image
          src={
            getUploadedImageUrl(image, "medium") ||
            "/assets/icons/shared/image_placeholder.svg"
          }
          alt={image?.alt || t("owner.propertyImage")}
          fill
          sizes="(max-width: 768px) 25vw, 160px"
          className="object-cover"
        />
        <span
          className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-md border text-xs font-bold ${
            isSelected
              ? "border-brand-600 bg-brand-600 text-white"
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
  onHide,
  property,
  extraPrice,
  onHideClick,
  noImageSubmit,
  selectedPlans,
  mutationOptions,
}: OwnerPhotoUpgradeModalProps) => {
  const formatToman = useFormatToman();

  const t = useTranslations();

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
      Notify({ type: "warn", body: t("owner.pickOneImage") });
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
              <p className="text-base text-center font-bold text-brand-600">
                {t("owner.photoUpgradeService")}
              </p>
              <div className="new-tag   rotate-[-9deg] text-xs font-bold  text-white rounded-lg  h-6 w-11 flex items-center justify-center ">
                {t("owner.new")}
              </div>
            </div>
            <p className="mt-1 line-clamp-1 text-center text-xs text-neutral-500">
              {property?.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onHide}
            className="flex h-9 absolute left-0  top-2  w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100"
          >
            <Image
              width={16}
              height={16}
              className="h-4 w-4"
              alt={t("common.close")}
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
                quality={PROPERTY_IMAGE_QUALITY}
                src={
                  getHomeImageUrl(upgradeContent?.feature_image) ||
                  "/assets/icons/shared/image_placeholder.svg"
                }
                alt={t("owner.photoUpgradeSample")}
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
          <div className="rounded-10 border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
            {t("owner.noImagesForListing")}
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
          <p className="text-brand-600  w-full text-sm text-center ">
            {t("owner.photoUpgradeDelay")}
          </p>
        ) : (
          <></>
        )}

        <div className="flex flex-col gap-2 rounded-10 border border-neutral-100 p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-neutral-500">
              {t("owner.photoCountLabel")}
            </span>
            <span className="font-medium">
              {t("owner.photosCount", { count: selectedImageIds.length })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-neutral-500">
              {t("owner.upgradeCostPerPhoto")}
            </span>
            <span className="font-medium">
              {formatToman(PHOTO_UPGRADE_PRICE)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 border-t pt-2 text-brand-600">
            <span className="font-medium">{t("owner.upgradeFinalCost")}</span>
            <span className="font-bold">
              {formatToman(totalAmount)}
            </span>
          </div>
          {!isEmpty(selectedPlans) ? (
            selectedPlans?.map((e) => (
              <div
                key={`slectedPlan${e?.id}`}
                className="flex items-center justify-between gap-2 border-t pt-2 text-brand-600"
              >
                <span className="font-medium">{e?.title}</span>
                <span className="font-bold">
                  {formatToman(e?.price_with_discount || e?.price)}
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
            title={`${t("common.pay")} ${totalAmount || !!extraPrice ? formatToman(totalAmount + Number(extraPrice || 0)) : ""} `}
          />
          {!!extraPrice ? (
            <></>
          ) : (
            <Button
              color="danger"
              containerClass={` `}
              title={t("owner.nowNow")}
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
