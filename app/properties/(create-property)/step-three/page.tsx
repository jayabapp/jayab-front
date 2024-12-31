"use client";
import { PropertyService } from "@/api_services/property/property.service";
import PageHeaders from "@/components/headers/PageHeader";
import SearchPlaceModal from "@/components/Map/SearchPlaceModal";
import SearchBox from "@/components/SearchBoxComp";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import ProgressBar from "@/components/shared/progressbar";
import StepShower from "@/components/shared/StepShower";
import MainUploader from "@/components/uploader";
import MultiUploader from "@/components/uploader/MultiUploader";
import { useStoreInit } from "@/store";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const CreatePropertyImages = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useStoreInit((data) => data);
  const [totalLength, setTotalLength] = useState(0);
  const [uploadedImages, setUploadedImages] = useState(0);
  const [uploaderLoading, setUploaderLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<string | number>(0);

  /* -------------------------------------------------------------------------- */
  /*                             INIT PROP  DATA                             */
  /* -------------------------------------------------------------------------- */
  const { data: initPropData } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY],
    queryFn: PropertyService.InitProperty,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertySetMdia,
    onSuccess: () => {
      router.push("/properties/step-four");
    },
  });

  useEffect(() => {
    if (!!initPropData?.feature_image_id) {
      setPrimaryImageId(initPropData?.feature_image_id || 0);
      setImages(initPropData?.attachments);
    }
  }, [initPropData]);

  const onSubmit = () => {
    if (initPropData?.id) {
      mutate({
        images: images?.map((e) => e?.id),
        feature_image_id: primaryImageId,
        propertyId: initPropData?.id,
      });
    }
  };
  return (
    <div
      id="homeParent"
      className="container   items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <PageHeaders title={_STRINGS.PROPERTY_MEDIA} />

      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        {" "}
        <StepShower steps={createPropertySteps} value={3} />
      </div>

      <div className=" flex items-start w-full flex-wrap gap-4">
        <div className=" w-full  min-h-8">
          {!!totalLength && !!uploaderLoading && totalLength > 1 ? (
            <div className="flex flex-col gap-2 w-full">
              <p className=" text-sm text-primary-700">
                {" "}
                {uploadedImages} از {totalLength}
              </p>
              <ProgressBar
                step={uploadedImages}
                divs={Array.from({ length: totalLength }, (v, k) => k).map((e, index) => ({
                  value: e,
                  id: e,
                  color: "#3886E5",
                  width: (100 * (index + 1)) / totalLength,
                }))}
              />{" "}
            </div>
          ) : (
            <></>
          )}
        </div>

        <MultiUploader
          innerClasses={{ sizeClass: " w-24 aspect-square h-24", secontParentClass: "w-24" }}
          title={"افزودن عکس"}
          link="/attachments?type=OWNER_PROPERTY_IMAGE"
          key={`uploader`}
          containerClass={" w-24  "}
          item={null}
          onSelect={(file) => {
            setImages((e) => [...e, file]);
          }}
          onDelete={() => {}}
          setTotalLength={setTotalLength}
          setUploadedImages={setUploadedImages}
          setUploaderLoading={setUploaderLoading}
        />
        {images?.map((e) => (
          <div
            onClick={() => {
              setPrimaryImageId(e?.id);
            }}
            className=" relative rounded-10"
            key={`uploader${e?.id}`}
          >
            <MultiUploader
              innerClasses={{ sizeClass: " w-24 aspect-square h-24", secontParentClass: "w-24" }}
              title={"افزودن عکس"}
              link="/attachments?type=OWNER_PROPERTY_IMAGE"
              key={`uploader${e?.id}`}
              containerClass={" w-24  "}
              item={e}
              onSelect={(file) => {}}
              onDelete={() => {
                setImages(images?.filter((i) => e?.id !== i?.id));
              }}
            />
            <div
              className={` ${
                primaryImageId == e?.id ? "opacity-100" : "opacity-0"
              } transition-all absolute text-xxs h-7 bottom-0 w-full flex items-center justify-center bg-white/60  text-gray-700`}
            >
              {_STRINGS.PRIMARY_IMAGE}{" "}
            </div>
          </div>
        ))}
      </div>

      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={_STRINGS.SUBMIT_MOVE_ON}
        />
      </FixedBottomContainer>
    </div>
  );
};

export default CreatePropertyImages;
