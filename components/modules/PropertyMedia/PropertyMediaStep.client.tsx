"use client";

import { useCallback, useState } from "react";
import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyDraftForm } from "@features/owner-property/hooks/usePropertyDraftForm";
import { createPropertySteps } from "@/utils/constantss";
import { emptyMediaValues } from "@features/owner-property/mappers/property-draft.mapper";
import { useTranslations } from "next-intl";
import { toMediaValues } from "@features/owner-property/mappers/property-draft.mapper";

import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import FixedBottomContainer from "@elements/FixedBottomContainer";
import UploadedMediaItem from "./parts/UploadedMediaItem.client";
import MultiImageUpload from "./uploaders/MultiImageUpload.client";
import StepShower from "@elements/StepShower";
import Button from "@elements/Button";
import isEmpty from "lodash/isEmpty";

const MEDIA_STEP_INDEX = 3;
const THUMB_SIZE = " w-28 md:w-36  ";

const PropertyMediaStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const t = useTranslations("owner");
  const tr = useTranslations();

  const { draft, isLoading, setValues, values } = usePropertyDraftForm(
    propertyId,
    emptyMediaValues,
    { canSeed: (saved) => !!saved?.feature_image_id, map: toMediaValues },
  );
  const { isPending, submit } = useOwnerPropertyStep("media", propertyId);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: any;
  }>({});

  const images = values.images;
  const featureImageId =
    values.featureImageId || images?.[0]?.data?.id || images?.[0]?.id || 0;

  const setImages = useCallback(
    (update: any[] | ((previous: any[]) => any[])) =>
      setValues((previous) => ({
        ...previous,
        images: typeof update === "function" ? update(previous.images) : update,
      })),
    [setValues],
  );

  const onSubmit = () => {
    if (!draft?.id) return;
    submit({
      feature_image_id: featureImageId,
      images: images?.map((image) => image?.data?.id),
      propertyId: draft?.id,
    });
  };

  return (
    <>
      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        <StepShower
          value={MEDIA_STEP_INDEX}
          steps={createPropertySteps(Number(propertyId), tr) || []}
        />
      </div>

      <div className="flex items-start w-full flex-wrap gap-4">
        <div className="bg-warning-600/5 border p-3 w-full rounded-10 border-status-warning flex flex-col gap-3">
          <p className="text-xs text-status-warning">
            {t("mediaHintLimit")}
          </p>
          <p className="text-xs text-status-warning">
            {isEmpty(images) ? "" : t("mediaHintPrimary")}
          </p>
          <p className="text-xs text-status-warning content text-justify">
            {t("mediaHintNetwork")}
          </p>
        </div>

        {isLoading ? (
          <PropertyEditStepSkeleton variant="media" />
        ) : (
          <>
            <MultiImageUpload
              item={null}
              images={images}
              onDelete={() => {}}
              loading={isUploading}
              setImages={setImages}
              title={t("addImage")}
              key="propertyMediaUploader"
              setLoading={setIsUploading}
              containerClass={THUMB_SIZE}
              imagesLoadings={uploadProgress}
              setimagesLoadings={setUploadProgress}
              link="/attachments?type=OWNER_PROPERTY_IMAGE"
              innerClasses={{
                secontParentClass: THUMB_SIZE,
                sizeClass: " w-28 md:w-36  aspect-square ",
              }}
            />
            {images?.map((image) => (
              <button
                type="button"
                className="relative rounded-10"
                key={`propertyImage${image?.id ?? image?.data?.id}`}
                onClick={() =>
                  setValues((previous) => ({
                    ...previous,
                    featureImageId: image?.data?.id,
                  }))
                }
              >
                <UploadedMediaItem
                  item={image}
                  cb={() => {}}
                  containerClass={THUMB_SIZE}
                  progress={uploadProgress?.[image?.id]}
                  onDelete={() =>
                    setImages((previous) =>
                      previous.filter(
                        (entry) => entry?.data?.id !== image?.data?.id,
                      ),
                    )
                  }
                  innerClasses={{
                    secontParentClass: "w-28 md:w-36",
                    sizeClass: " w-28 md:w-36 aspect-square h-28 md:h-36",
                  }}
                />
                <div
                  className={`${
                    featureImageId && featureImageId == image?.data?.id
                      ? "opacity-100"
                      : "opacity-0"
                  } transition-all absolute text-2xs h-7 bottom-0 w-full flex items-center justify-center bg-surface/60 z-5 text-ink-muted`}
                >
                  {t("primaryImage")}
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      <FixedBottomContainer>
        <Button
          onClick={onSubmit}
          loading={isPending}
          width=" w-[90%] md:w-1/2"
          title={t("submitMoveOn")}
          roundedClass="rounded-full"
          disabled={isUploading || isPending}
          containerClass="w-full flex items-center justify-center"
        />
      </FixedBottomContainer>
    </>
  );
};

export default PropertyMediaStep;
