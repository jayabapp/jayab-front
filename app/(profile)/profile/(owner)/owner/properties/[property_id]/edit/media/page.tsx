"use client";
import { ImageDto } from "@/api_services/auth/auth.interface";
import { PropertyService } from "@/api_services/property/property.service";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import StepShower from "@/components/shared/StepShower";
import FullscreenImage from "@/components/uploader/FullScreenImage";
import NewMultUploader from "@/components/uploader/NewMultUploader";

import UploadedItemShowCase from "@/components/uploader/UploadedItemShowCase";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMutation, useQuery } from "@tanstack/react-query";
import isEmpty from "lodash/isEmpty";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  /* -------------------------------------------------------------------------- */
  /*                             INIT PROP CREATION                             */
  /* -------------------------------------------------------------------------- */
  const { data: initPropData, isLoading } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, property_id],
    queryFn: () => {
      if (!!property_id) {
        return PropertyService.InitProperty({ property_id: `${property_id}` });
      } else return null;
    },
    gcTime: 0,
    staleTime: 0,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertySetMdia,
    onSuccess: () => {
      if (!!edit_mode) {
        router.replace(`/profile/owner/properties/${property_id}/edit`);
      } else {
        router.push(
          `/profile/owner/properties/${property_id}/edit/environment`,
        );
      }
    },
  });

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
    if (!primaryImageId && !isEmpty(images)) {
      setPrimaryImageId(images?.[0]?.data?.id);
    }
  }, [images]);

  return (
    <div
      id="homeParent"
      className="profile-container    items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        <StepShower
          steps={createPropertySteps(initPropData?.id) || []}
          value={3}
        />
      </div>

      <div className=" flex items-start w-full flex-wrap gap-4">
        <div className=" bg-primary-350/5 border p-3  w-full  rounded-10 border-primary-350  flex flex-col gap-3">
          <p className="text-xs text-primary-350">
            1- حداکثر تعداد آپلود همزمان عکس 10 عدد میباشد.
          </p>
          <p className="text-xs text-primary-350">
            {!isEmpty(images)
              ? "2- عکس اصلی خود را با ضربه زدن روی عکس مورد نظر انتخاب کنید."
              : ""}
          </p>
          <p className="text-xs text-primary-350">
            3- در صورت بروز اختلال در شبکه اینترنت، میتوانید ابتدا یک عکس آپلود
            و پس از اتمام مراحل ثبت اقامتگاه، مجددا تصاویر بیشتری بارگذاری
            نمائید.
          </p>
        </div>
        {isLoading ? (
          <div className="w-full flex items-center justify-center">
            <LottieLoading margin="w-full" />
          </div>
        ) : (
          <>
            <NewMultUploader
              setLoading={setLoading}
              loading={loading}
              innerClasses={{
                sizeClass: " w-28 md:w-36  aspect-square ",
                secontParentClass: "  w-28 md:w-36 ",
              }}
              title={"افزودن عکس"}
              link="/attachments?type=OWNER_PROPERTY_IMAGE"
              key={`uploader`}
              containerClass={" w-28 md:w-36    "}
              item={null}
              setImages={setImages}
              onDelete={() => {}}
              images={images}
              setimagesLoadings={setimagesLoadings}
              imagesLoadings={imagesLoadings}
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
                  cb={() => {
                    // setSelectedFullScreen(e);
                    // setShow(true);
                  }}
                  innerClasses={{
                    sizeClass: " w-28 md:w-36 aspect-square h-28 md:h-36",
                    secontParentClass: "w-28 md:w-36",
                  }}
                  key={`uploader${e?.id}`}
                  containerClass={" w-28 md:w-36  "}
                  item={e}
                  progress={imagesLoadings?.[e?.id]}
                  onDelete={() => {
                    setImages(arr?.filter((i) => e?.data?.id !== i?.data?.id));
                  }}
                />
                <div
                  className={` ${
                    !!primaryImageId && primaryImageId == e?.data?.id
                      ? "opacity-100"
                      : "opacity-0"
                  } transition-all absolute text-xxs h-7 bottom-0 w-full flex items-center justify-center bg-white/60  text-gray-700`}
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
          onClick={() => {
            onSubmit();
          }}
          loading={isPending}
          disabled={loading}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={_STRINGS.SUBMIT_MOVE_ON}
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
