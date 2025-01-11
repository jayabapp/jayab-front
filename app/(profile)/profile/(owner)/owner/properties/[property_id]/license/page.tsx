"use client";
import { PropertyService } from "@/api_services/property/property.service";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import ProgressBar from "@/components/shared/progressbar";
import StatusShower from "@/components/shared/StatusShower";
import MainUploader from "@/components/uploader";
import MultiUploader from "@/components/uploader/MultiUploader";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Authorize = () => {
  const params = useParams();
  const { property_id } = params;
  const [nationalImage, setNationalImage] = useState<any>(null);
  const [totalLength, setTotalLength] = useState(0);
  const [uploadedImages, setUploadedImages] = useState(0);
  const [uploaderLoading, setUploaderLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const { isLoading, data } = useQuery({
    queryKey: [PropertyService.OWNER_PROPERTIES_SINGLE_AUTH_CACHEKEY, property_id],
    queryFn: () => {
      if (!!property_id) {
        return PropertyService.GetSingleOwnerPropertyAuthStatus({ property_id: `${property_id}` });
      } else return null;
    },
  });

  const { mutate, isPending } = useMutation({ mutationFn: PropertyService.RequestSingleOwnerPropertyAuth });
  const { mutate: editMutate, isPending: editPendin } = useMutation({
    mutationFn: PropertyService.EditRequestSingleOwnerPropertyAuth,
  });

  const onSubmit = () => {
    if (data?.status) {
      editMutate({
        docs: images?.map((e) => e?.id) || [],
        nc_image_id: nationalImage?.id,
        property_id: `${property_id}`,
      });
    } else {
      mutate({ docs: images?.map((e) => e?.id) || [], nc_image_id: nationalImage?.id, property_id: `${property_id}` });
    }
  };

  useEffect(() => {
    if (!!data) {
      setNationalImage(data?.nc_image);
      setImages(data?.docs);
    }
  }, [data]);

  return (
    <div
      id="homeParent"
      className="profile-container   items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full flex items-center justify-between">
        {" "}
        <p className=" font-bold  text-primary-700  text-start">{_STRINGS.AUTHORiZIATION_REQUEST}</p>
        <StatusShower data={data?.status} />
      </div>
      <div
        className="w-full flex items-center justify-center
 flex-col"
      >
        <p className="w-full text-start">{_STRINGS.NATIONAL_CARD_IMAGE} :</p>

        <MainUploader
          title={_STRINGS.IMAGE}
          withCrop
          // isLogo
          link="/attachments?type=OWNER_PROPERTY_DOCS"
          key={`uploader`}
          containerClass={"my-3  w-full flex items-center justify-center "}
          item={nationalImage}
          onSelect={(file) => {
            setNationalImage(file);
          }}
          onDelete={
            data?.status?.id != 100
              ? () => {
                  setNationalImage(null);
                }
              : undefined
          }
        />
      </div>

      <div className=" flex items-start w-full flex-wrap gap-2">
        <p>{_STRINGS.DOCS_IMAGES}</p>
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

        {data?.status?.id != 100 ? (
          <MultiUploader
            innerClasses={{ sizeClass: " w-24 aspect-square h-24", secontParentClass: "w-24" }}
            title={"افزودن عکس"}
            link="/attachments?type=OWNER_PROPERTY_DOCS"
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
        ) : (
          <></>
        )}
        {images?.map((e) => (
          <MultiUploader
            activeFull
            innerClasses={{ sizeClass: " w-24 aspect-square h-24", secontParentClass: "w-24" }}
            title={"افزودن عکس"}
            link="/attachments?type=OWNER_PROPERTY_DOCS"
            key={`uploader${e?.id}`}
            containerClass={" w-24  "}
            item={e}
            onSelect={(file) => {}}
            onDelete={
              data?.status?.id != 100
                ? () => {
                    setImages(images?.filter((i) => e?.id !== i?.id));
                  }
                : undefined
            }
          />
        ))}
      </div>
      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending || editPendin}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={_STRINGS.SUBMIT_REQUEST}
        />
      </FixedBottomContainer>
    </div>
  );
};

export default Authorize;
