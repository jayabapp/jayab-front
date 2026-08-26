"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePropertyAuthorization } from "@features/owner-property/hooks/usePropertyAuthorization";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import StatusShower from "@/components/shared/StatusShower";
import ProgressBar from "@/components/shared/progressbar";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import dynamic from "next/dynamic";

const MainUploader = dynamic(() => import("@/components/uploader"));

const Authorize = () => {
  const router = useRouter();
  const params = useParams();
  const { property_id } = params;
  const [nationalImage, setNationalImage] = useState<any>(null);
  const [totalLength] = useState(0);
  const [uploadedImages] = useState(0);
  const [uploaderLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const propertyId = `${property_id ?? ""}`;
  const { isLoading, data, request, edit } =
    usePropertyAuthorization(propertyId);
  const { mutate, isPending } = request;
  const { mutate: editMutate, isPending: editPendin } = edit;

  const onSubmit = () => {
    if (data?.status) {
      editMutate(
        {
          docs: images?.map((e) => e?.id) || [],
          nc_image_id: nationalImage?.id,
          property_id: `${property_id}`,
        },
        { onSuccess: () => router.back() },
      );
    } else {
      mutate(
        {
          docs: images?.map((e) => e?.id) || [],
          nc_image_id: nationalImage?.id,
          property_id: `${property_id}`,
        },
        { onSuccess: () => router.back() },
      );
    }
  };

  const isLocked = data?.status?.id === 100;
  const uploadPercent =
    totalLength > 0 ? Math.round((uploadedImages / totalLength) * 100) : 0;

  useEffect(() => {
    if (!!data) {
      setNationalImage(data?.nc_image);
      setImages(data?.docs || []);
    }
  }, [data]);

  if (isLoading) return <PropertyEditStepSkeleton variant="media" />;

  return (
    <div
      id="homeParent"
      className="profile-container items-center transition-all duration-500 ease-in-out flex flex-col gap-6"
    >
      <div className="w-full flex items-center justify-between">
        <p className="font-bold text-primary-700 text-start">
          {_STRINGS.AUTHORiZIATION_REQUEST}
        </p>
        <StatusShower data={data?.status} />
      </div>

      <div className="w-full flex items-center justify-center flex-col">
        <p className="w-full text-start">
          {_STRINGS.NATIONAL_CARD_IMAGE_AUTH} :
        </p>

        <MainUploader
          withCrop
          item={nationalImage}
          title={_STRINGS.IMAGE}
          key="uploader-national"
          link="/attachments?type=OWNER_PROPERTY_DOCS"
          containerClass="my-3 w-full flex items-start justify-start"
          onSelect={(file) => {
            setNationalImage(file);
          }}
          onDelete={
            !isLocked
              ? () => {
                  setNationalImage(null);
                }
              : undefined
          }
        />
      </div>

      <div className="flex items-start w-full flex-wrap gap-2">
        <p>{_STRINGS.DOCS_IMAGE_AUTH} :</p>

        <div className="w-full min-h-8">
          {uploaderLoading && totalLength > 1 && (
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-primary-700">
                {uploadedImages} از {totalLength}
              </p>
              <ProgressBar progress={uploadPercent} color="#3886E5" />
            </div>
          )}
        </div>

        {!isLocked && (
          <MainUploader
            innerClasses={{
              sizeClass: "w-24 aspect-square h-24",
              secontParentClass: "w-24",
            }}
            title="افزودن عکس"
            link="/attachments?type=OWNER_PROPERTY_DOCS"
            key="uploader-add"
            containerClass="w-24"
            item={null}
            onSelect={(file) => {
              setImages((prev) => [...prev, file]);
            }}
            onDelete={() => {}}
          />
        )}

        {images?.map((e) => (
          <MainUploader
            innerClasses={{
              sizeClass: "w-24 aspect-square h-24",
              secontParentClass: "w-24",
            }}
            title="افزودن عکس"
            link="/attachments?type=OWNER_PROPERTY_DOCS"
            key={`uploader-${e?.id}`}
            containerClass="w-24"
            item={e}
            onSelect={() => {}}
            onDelete={
              !isLocked
                ? () => {
                    setImages((prev) => prev.filter((i) => e?.id !== i?.id));
                  }
                : undefined
            }
          />
        ))}
      </div>

      <FixedBottomContainer>
        <Button
          onClick={onSubmit}
          width="w-[90%] md:w-1/2"
          roundedClass="rounded-full"
          title={_STRINGS.SUBMIT_REQUEST}
          loading={isPending || editPendin}
          containerClass="w-full flex items-center justify-center"
        />
      </FixedBottomContainer>
    </div>
  );
};

export default Authorize;
