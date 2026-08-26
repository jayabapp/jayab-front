"use client";
import { PropertyService } from "@/api_services/property/property.service";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import ProgressBar from "@/components/shared/progressbar";
import StatusShower from "@/components/shared/StatusShower";
import MainUploader from "@/components/uploader";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Authorize = () => {
  const router = useRouter();
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

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.RequestSingleOwnerPropertyAuth,
    onSuccess: () => {
      router.back();
    },
  });
  const { mutate: editMutate, isPending: editPendin } = useMutation({
    mutationFn: PropertyService.EditRequestSingleOwnerPropertyAuth,
    onSuccess: () => {
      router.back();
    },
  });

  const onSubmit = () => {
    if (data?.status) {
      editMutate({
        docs: images?.map((e) => e?.id) || [],
        nc_image_id: nationalImage?.id,
        property_id: `${property_id}`,
      });
    } else {
      mutate({
        docs: images?.map((e) => e?.id) || [],
        nc_image_id: nationalImage?.id,
        property_id: `${property_id}`,
      });
    }
  };

  const isLocked = data?.status?.id === 100;
  const uploadPercent = totalLength > 0 ? Math.round((uploadedImages / totalLength) * 100) : 0;

  useEffect(() => {
    if (!!data) {
      setNationalImage(data?.nc_image);
      setImages(data?.docs || []);
    }
  }, [data]);

  return (
    <div
      id="homeParent"
      className="profile-container items-center transition-all duration-500 ease-in-out flex flex-col gap-6"
    >
      <div className="w-full flex items-center justify-between">
        <p className="font-bold text-primary-700 text-start">{_STRINGS.AUTHORiZIATION_REQUEST}</p>
        <StatusShower data={data?.status} />
      </div>

      <div className="w-full flex items-center justify-center flex-col">
        <p className="w-full text-start">{_STRINGS.NATIONAL_CARD_IMAGE_AUTH} :</p>

        <MainUploader
          title={_STRINGS.IMAGE}
          withCrop
          link="/attachments?type=OWNER_PROPERTY_DOCS"
          key="uploader-national"
          containerClass="my-3 w-full flex items-start justify-start"
          item={nationalImage}
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
          loading={isPending || editPendin}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width="w-[90%] md:w-1/2"
          title={_STRINGS.SUBMIT_REQUEST}
        />
      </FixedBottomContainer>
    </div>
  );
};

export default Authorize;
