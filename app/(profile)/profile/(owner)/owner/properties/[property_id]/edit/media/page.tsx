"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { usePropertyDraftStep } from "@features/owner-property/hooks/usePropertyDraftStep";
import { createPropertySteps } from "@/utils/constantss";
import { useEffect, useState } from "react";
import { usePropertyDraft } from "@features/owner-property/hooks/usePropertyDraft";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { ImageDto } from "@/api_services/auth/auth.interface";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import UploadedItemShowCase from "@/components/uploader/UploadedItemShowCase";
import FullscreenImage from "@/components/uploader/FullScreenImage";
import NewMultUploader from "@/components/uploader/NewMultUploader";
import StepShower from "@/components/shared/StepShower";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import Button from "@/components/shared/Button/Button";

const CreatePropertyImages = () => {
  const [loading, setLoading] = useState(false);
  const [imagesLoadings, setimagesLoadings] = useState<{ [key: string]: any }>(
    {},
  );

  const [show, setShow] = useState(false);
  const [selectedFullScreen, setSelectedFullScreen] = useState<ImageDto | null>(
    null,
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const edit_mode = searchParams.get("edit_mode");

  const [images, setImages] = useState<any[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<string | number>(0);
  const params = useParams();
  const { property_id } = params;
  const propertyId = `${property_id ?? ""}`;
  const { data: initPropData, isLoading } = usePropertyDraft(propertyId);

  const { mutate, isPending } = usePropertyDraftStep(
    "media",
    propertyId,
    () => {
      if (!!edit_mode)
        router.replace(`/profile/owner/properties/${property_id}/edit`);
      else
        router.push(
          `/profile/owner/properties/${property_id}/edit/environment`,
        );
    },
  );

  useEffect(() => {
    if (!!initPropData?.feature_image_id) {
      setPrimaryImageId(initPropData?.feature_image_id || 0);
      setImages(initPropData?.attachments?.map((e) => ({ data: e })) || []);
    }
  }, [initPropData]);

  const onSubmit = () => {
    if (initPropData?.id) {
      mutate({
        images: images?.map((e) => e?.data?.id),
        feature_image_id: primaryImageId,
        propertyId: initPropData?.id,
      });
    }
  };

  useEffect(() => {
    if (!primaryImageId && !isEmpty(images))
      setPrimaryImageId(images?.[0]?.data?.id);
  }, [images]);

  return (
    <div
      id="homeParent"
      className="profile-container    items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        <StepShower
          value={3}
          steps={createPropertySteps(initPropData?.id) || []}
        />
      </div>

      <div className=" flex items-start w-full flex-wrap gap-4">
        <div className=" bg-warning-600/5 border p-3  w-full  rounded-10 border-warning-600  flex flex-col gap-3">
          <p className="text-xs text-warning-600">
            1- حداکثر تعداد آپلود همزمان عکس 10 عدد میباشد.
          </p>
          <p className="text-xs text-warning-600">
            {!isEmpty(images)
              ? "2- عکس اصلی خود را با ضربه زدن روی عکس مورد نظر انتخاب کنید."
              : ""}
          </p>
          <p className="text-xs text-warning-600 content text-justify">
            3- در صورت بروز اختلال در شبکه اینترنت، میتوانید ابتدا یک عکس آپلود
            و پس از اتمام مراحل ثبت اقامتگاه، مجددا تصاویر بیشتری بارگذاری
            نمائید.
          </p>
        </div>
        {isLoading ? (
          <PropertyEditStepSkeleton variant="media" />
        ) : (
          <>
            <NewMultUploader
              item={null}
              images={images}
              key={`uploader`}
              loading={loading}
              onDelete={() => {}}
              title={"افزودن عکس"}
              setImages={setImages}
              setLoading={setLoading}
              imagesLoadings={imagesLoadings}
              containerClass={" w-28 md:w-36    "}
              setimagesLoadings={setimagesLoadings}
              link="/attachments?type=OWNER_PROPERTY_IMAGE"
              innerClasses={{
                sizeClass: " w-28 md:w-36  aspect-square ",
                secontParentClass: "  w-28 md:w-36 ",
              }}
            />
            {images?.map((e, index, arr) => (
              <div
                onClick={() => {
                  setPrimaryImageId(e?.data?.id);
                }}
                className=" relative rounded-10"
                key={`uploader${e?.id}`}
              >
                <UploadedItemShowCase
                  item={e}
                  cb={() => {}}
                  key={`uploader${e?.id}`}
                  progress={imagesLoadings?.[e?.id]}
                  containerClass={" w-28 md:w-36  "}
                  innerClasses={{
                    sizeClass: " w-28 md:w-36 aspect-square h-28 md:h-36",
                    secontParentClass: "w-28 md:w-36",
                  }}
                  onDelete={() => {
                    setImages(arr?.filter((i) => e?.data?.id !== i?.data?.id));
                  }}
                />
                <div
                  className={` ${
                    !!primaryImageId && primaryImageId == e?.data?.id
                      ? "opacity-100"
                      : "opacity-0"
                  } transition-all absolute text-xxs h-7 bottom-0 w-full flex items-center justify-center bg-white/60   z-5 text-neutral-600`}
                >
                  {_STRINGS.PRIMARY_IMAGE}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <FixedBottomContainer>
        <Button
          disabled={loading}
          loading={isPending}
          width=" w-[90%] md:w-1/2"
          roundedClass="rounded-full"
          title={_STRINGS.SUBMIT_MOVE_ON}
          containerClass="w-full flex items-center justify-center"
          onClick={() => {
            onSubmit();
          }}
        />
      </FixedBottomContainer>

      {show && (
        <FullscreenImage
          setShow={() => {
            setShow(false);
            setTimeout(() => {
              setSelectedFullScreen(null);
            }, 1);
          }}
          show={show}
          src={NEW_IMAGE_URL(selectedFullScreen)}
          onDelete={() => {
            setImages(images?.filter((i) => selectedFullScreen?.id !== i?.id));

            setShow(false);
          }}
        />
      )}
    </div>
  );
};

export default CreatePropertyImages;
